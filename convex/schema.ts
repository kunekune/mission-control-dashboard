import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
  }),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(), // hex color for project identification
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  tasks: defineTable({
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
    agentAssigneeId: v.optional(v.id("team_members")), // AI Agent assignment
    assigneeType: v.optional(v.union(
      v.literal("user"),    // Human user
      v.literal("agent")    // AI agent
    )),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
    orderIndex: v.number(), // for drag & drop ordering
  }),

  comments: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }),

  activity: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    action: v.union(
      v.literal("created"),
      v.literal("updated"),
      v.literal("status_changed"),
      v.literal("assigned"),
      v.literal("completed"),
      v.literal("commented")
    ),
    details: v.optional(v.string()), // JSON string for action details
    createdAt: v.number(),
  }),

  content: defineTable({
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
    attachments: v.optional(v.array(v.string())),
    assigneeId: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
    orderIndex: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  scheduled_events: defineTable({
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
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    assigneeId: v.optional(v.id("users")),
    taskId: v.optional(v.id("tasks")),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    color: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    completionNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  memory_documents: defineTable({
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    category: v.union(
      v.literal("personal"),
      v.literal("project"),
      v.literal("learning"),
      v.literal("reference"),
      v.literal("archived")
    ),
    tags: v.optional(v.array(v.string())),
    authorId: v.optional(v.id("users")),
    sourceUrl: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    relatedDocuments: v.optional(v.array(v.id("memory_documents"))),
    wordCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  team_members: defineTable({
    name: v.string(),
    role: v.string(),
    aiModel: v.string(),
    hierarchyLevel: v.union(
      v.literal("lead"),
      v.literal("senior"),
      v.literal("specialist"),
      v.literal("support")
    ),
    specialties: v.array(v.string()),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    color: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("busy"),
      v.literal("idle"),
      v.literal("maintenance")
    ),
    costPerHour: v.optional(v.number()),
    totalSessions: v.number(),
    totalHours: v.number(),
    successRate: v.number(),
    lastActiveAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  agent_sessions: defineTable({
    agentId: v.id("team_members"),
    taskTitle: v.string(),
    taskDescription: v.optional(v.string()),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    estimatedDuration: v.optional(v.number()), // minutes
    estimatedCost: v.optional(v.number()),
    actualCost: v.optional(v.number()),
    duration: v.optional(v.number()), // actual duration in minutes
    result: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
});