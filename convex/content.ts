import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all content items
export const getContent = query({
  args: {
    stage: v.optional(v.union(
      v.literal("ideas"),
      v.literal("scripting"), 
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("published")
    )),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { stage, projectId }) => {
    let query = ctx.db.query("content");
    
    if (stage) {
      query = query.filter((q) => q.eq(q.field("stage"), stage));
    }
    if (projectId) {
      query = query.filter((q) => q.eq(q.field("projectId"), projectId));
    }

    const content = await query.order("desc").collect();
    
    // Join with user and project data
    const contentWithDetails = await Promise.all(
      content.map(async (item) => {
        const assignee = item.assigneeId 
          ? await ctx.db.get(item.assigneeId)
          : null;
        const project = item.projectId 
          ? await ctx.db.get(item.projectId)
          : null;
        
        return {
          ...item,
          assignee,
          project,
        };
      })
    );

    return contentWithDetails;
  },
});

// Get content pipeline metrics
export const getContentMetrics = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    
    return {
      total: content.length,
      byStage: {
        ideas: content.filter(c => c.stage === "ideas").length,
        scripting: content.filter(c => c.stage === "scripting").length,
        thumbnail: content.filter(c => c.stage === "thumbnail").length,
        filming: content.filter(c => c.stage === "filming").length,
        editing: content.filter(c => c.stage === "editing").length,
        published: content.filter(c => c.stage === "published").length,
      }
    };
  },
});

// Create new content item
export const createContent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    stage: v.union(
      v.literal("ideas"),
      v.literal("scripting"), 
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("published")
    ),
    contentType: v.union(
      v.literal("video"),
      v.literal("blog"),
      v.literal("podcast"),
      v.literal("social")
    ),
    script: v.optional(v.string()),
    notes: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())), // File URLs
    assigneeId: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const contentId = await ctx.db.insert("content", {
      ...args,
      createdAt: now,
      updatedAt: now,
      orderIndex: now, // Use timestamp for initial ordering
    });

    return contentId;
  },
});

// Update content stage
export const updateContentStage = mutation({
  args: {
    contentId: v.id("content"),
    stage: v.union(
      v.literal("ideas"),
      v.literal("scripting"), 
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("published")
    ),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, { contentId, stage, orderIndex }) => {
    const now = Date.now();
    
    await ctx.db.patch(contentId, {
      stage,
      orderIndex: orderIndex || now,
      updatedAt: now,
    });

    return contentId;
  },
});

// Update content details
export const updateContent = mutation({
  args: {
    contentId: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    script: v.optional(v.string()),
    notes: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    assigneeId: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { contentId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(contentId, {
      ...updates,
      updatedAt: now,
    });

    return contentId;
  },
});

// Delete content item
export const deleteContent = mutation({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, { contentId }) => {
    await ctx.db.delete(contentId);
    return contentId;
  },
});