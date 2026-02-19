import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get scheduled events
export const getScheduledEvents = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    eventType: v.optional(v.union(
      v.literal("cron"),
      v.literal("task"),
      v.literal("meeting"),
      v.literal("deadline")
    )),
  },
  handler: async (ctx, { startDate, endDate, eventType }) => {
    let query = ctx.db.query("scheduled_events");
    
    if (startDate && endDate) {
      query = query.filter((q) => 
        q.and(
          q.gte(q.field("scheduledAt"), startDate),
          q.lte(q.field("scheduledAt"), endDate)
        )
      );
    }
    
    if (eventType) {
      query = query.filter((q) => q.eq(q.field("eventType"), eventType));
    }

    const events = await query.order("asc").collect();
    
    // Join with related data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const assignee = event.assigneeId 
          ? await ctx.db.get(event.assigneeId)
          : null;
        const relatedTask = event.taskId 
          ? await ctx.db.get(event.taskId)
          : null;
        
        return {
          ...event,
          assignee,
          relatedTask,
        };
      })
    );

    return eventsWithDetails;
  },
});

// Get cron jobs from system
export const getCronJobs = query({
  args: {},
  handler: async (ctx) => {
    const cronJobs = await ctx.db.query("scheduled_events")
      .filter((q) => q.eq(q.field("eventType"), "cron"))
      .order("asc")
      .collect();
    
    return cronJobs;
  },
});

// Get calendar metrics
export const getCalendarMetrics = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const thisWeekEvents = await ctx.db.query("scheduled_events")
      .filter((q) => 
        q.and(
          q.gte(q.field("scheduledAt"), startOfWeek.getTime()),
          q.lte(q.field("scheduledAt"), endOfWeek.getTime())
        )
      )
      .collect();
    
    const overdue = await ctx.db.query("scheduled_events")
      .filter((q) => 
        q.and(
          q.lt(q.field("scheduledAt"), now),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    return {
      thisWeek: thisWeekEvents.length,
      overdue: overdue.length,
      total: (await ctx.db.query("scheduled_events").collect()).length,
      byType: {
        cron: thisWeekEvents.filter(e => e.eventType === "cron").length,
        task: thisWeekEvents.filter(e => e.eventType === "task").length,
        meeting: thisWeekEvents.filter(e => e.eventType === "meeting").length,
        deadline: thisWeekEvents.filter(e => e.eventType === "deadline").length,
      }
    };
  },
});

// Create scheduled event
export const createScheduledEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    eventType: v.union(
      v.literal("cron"),
      v.literal("task"),
      v.literal("meeting"),
      v.literal("deadline")
    ),
    scheduledAt: v.number(),
    duration: v.optional(v.number()), // in minutes
    cronExpression: v.optional(v.string()),
    recurring: v.optional(v.boolean()),
    recurringPattern: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
    taskId: v.optional(v.id("tasks")),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const eventId = await ctx.db.insert("scheduled_events", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return eventId;
  },
});

// Update scheduled event
export const updateScheduledEvent = mutation({
  args: {
    eventId: v.id("scheduled_events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
    duration: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    )),
    assigneeId: v.optional(v.id("users")),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(eventId, {
      ...updates,
      updatedAt: now,
    });

    return eventId;
  },
});

// Delete scheduled event
export const deleteScheduledEvent = mutation({
  args: {
    eventId: v.id("scheduled_events"),
  },
  handler: async (ctx, { eventId }) => {
    await ctx.db.delete(eventId);
    return eventId;
  },
});

// Mark event as completed
export const completeScheduledEvent = mutation({
  args: {
    eventId: v.id("scheduled_events"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { eventId, notes }) => {
    const now = Date.now();
    
    await ctx.db.patch(eventId, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
      completionNotes: notes,
    });

    return eventId;
  },
});