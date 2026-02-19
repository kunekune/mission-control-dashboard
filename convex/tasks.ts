import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks with optional filtering
export const getTasks = query({
  args: {
    status: v.optional(v.union(
      v.literal("recurring"),
      v.literal("backlog"), 
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    )),
    projectId: v.optional(v.id("projects")),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, { status, projectId, assigneeId }) => {
    let query = ctx.db.query("tasks");
    
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }
    if (projectId) {
      query = query.filter((q) => q.eq(q.field("projectId"), projectId));
    }
    if (assigneeId) {
      query = query.filter((q) => q.eq(q.field("assigneeId"), assigneeId));
    }

    const tasks = await query.order("desc").collect();
    
    // Join with user and project data
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const assignee = task.assigneeId 
          ? await ctx.db.get(task.assigneeId)
          : null;
        const project = task.projectId 
          ? await ctx.db.get(task.projectId)
          : null;
        
        return {
          ...task,
          assignee,
          project,
        };
      })
    );

    return tasksWithDetails;
  },
});

// Get task dashboard metrics
export const getDashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    const thisWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const thisWeekTasks = tasks.filter(task => task.createdAt > thisWeek);
    
    const inProgressTasks = tasks.filter(task => task.status === "in_progress");
    const completedTasks = tasks.filter(task => task.status === "done");
    
    const completionPercentage = tasks.length > 0 
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

    return {
      thisWeek: thisWeekTasks.length,
      inProgress: inProgressTasks.length, 
      total: tasks.length,
      completionPercentage,
      byStatus: {
        recurring: tasks.filter(t => t.status === "recurring").length,
        backlog: tasks.filter(t => t.status === "backlog").length,
        in_progress: tasks.filter(t => t.status === "in_progress").length,
        review: tasks.filter(t => t.status === "review").length,
        done: tasks.filter(t => t.status === "done").length,
      }
    };
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("recurring"),
      v.literal("backlog"), 
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assigneeId: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Get the highest order index for this status
    const tasksInStatus = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
    
    const maxOrder = Math.max(0, ...tasksInStatus.map(t => t.orderIndex));
    
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdAt: now,
      updatedAt: now,
      orderIndex: maxOrder + 1,
    });

    // Log activity
    if (args.assigneeId) {
      await ctx.db.insert("activity", {
        taskId,
        userId: args.assigneeId,
        action: "created",
        createdAt: now,
      });
    }

    return taskId;
  },
});

// Update task status (for drag & drop)
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("recurring"),
      v.literal("backlog"), 
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    orderIndex: v.number(),
  },
  handler: async (ctx, { taskId, status, orderIndex }) => {
    const now = Date.now();
    
    await ctx.db.patch(taskId, {
      status,
      orderIndex,
      updatedAt: now,
      ...(status === "done" ? { completedAt: now } : {}),
    });

    // Log activity
    await ctx.db.insert("activity", {
      taskId,
      userId: taskId, // This would be the current user in real app
      action: "status_changed",
      details: JSON.stringify({ newStatus: status }),
      createdAt: now,
    });

    return taskId;
  },
});

// Update task details
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    assigneeId: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activity", {
      taskId,
      userId: taskId, // This would be the current user in real app
      action: "updated",
      details: JSON.stringify(updates),
      createdAt: now,
    });

    return taskId;
  },
});

// Delete a task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, { taskId }) => {
    // Delete associated comments and activities
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("taskId"), taskId))
      .collect();
    
    const activities = await ctx.db
      .query("activity")
      .filter((q) => q.eq(q.field("taskId"), taskId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    
    for (const activity of activities) {
      await ctx.db.delete(activity._id);
    }

    await ctx.db.delete(taskId);
    return taskId;
  },
});