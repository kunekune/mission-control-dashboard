import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all projects
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    
    // Add task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const tasks = await ctx.db
          .query("tasks")
          .filter((q) => q.eq(q.field("projectId"), project._id))
          .collect();
        
        const completedTasks = tasks.filter(task => task.status === "done");
        
        return {
          ...project,
          taskCount: tasks.length,
          completedTaskCount: completedTasks.length,
          completionPercentage: tasks.length > 0 
            ? Math.round((completedTasks.length / tasks.length) * 100)
            : 0,
        };
      })
    );

    return projectsWithCounts;
  },
});

// Get project by ID
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) return null;

    const owner = await ctx.db.get(project.ownerId);
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .collect();

    return {
      ...project,
      owner,
      taskCount: tasks.length,
      completedTaskCount: tasks.filter(t => t.status === "done").length,
    };
  },
});

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return projectId;
  },
});

// Update project details
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    ownerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(projectId, {
      ...updates,
      updatedAt: now,
    });
    
    return projectId;
  },
});

// Delete project (and associated tasks)
export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    // Get all tasks for this project
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .collect();

    // Delete all associated tasks, comments, and activities
    for (const task of tasks) {
      const comments = await ctx.db
        .query("comments")
        .filter((q) => q.eq(q.field("taskId"), task._id))
        .collect();
      
      const activities = await ctx.db
        .query("activity")
        .filter((q) => q.eq(q.field("taskId"), task._id))
        .collect();

      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }
      
      for (const activity of activities) {
        await ctx.db.delete(activity._id);
      }

      await ctx.db.delete(task._id);
    }

    // Delete the project
    await ctx.db.delete(projectId);
    return projectId;
  },
});