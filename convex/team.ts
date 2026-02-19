import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all team members (agents)
export const getTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("team_members").collect();
    
    // Get recent activity for each member
    const membersWithActivity = await Promise.all(
      members.map(async (member) => {
        const recentSessions = await ctx.db
          .query("agent_sessions")
          .filter((q) => q.eq(q.field("agentId"), member._id))
          .order("desc")
          .take(5);
        
        const activeSessions = recentSessions.filter(s => s.status === "running").length;
        const totalSessions = recentSessions.length;
        
        return {
          ...member,
          activeSessions,
          totalSessions,
          recentSessions: recentSessions.slice(0, 3),
          lastActive: recentSessions[0]?.createdAt || member.createdAt,
        };
      })
    );

    return membersWithActivity;
  },
});

// Get team hierarchy and structure
export const getTeamHierarchy = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("team_members").collect();
    
    // Organize by hierarchy level
    const hierarchy = {
      lead: members.filter(m => m.hierarchyLevel === "lead"),
      senior: members.filter(m => m.hierarchyLevel === "senior"), 
      specialist: members.filter(m => m.hierarchyLevel === "specialist"),
      support: members.filter(m => m.hierarchyLevel === "support"),
    };
    
    return hierarchy;
  },
});

// Get team performance metrics
export const getTeamMetrics = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("team_members").collect();
    const sessions = await ctx.db.query("agent_sessions").collect();
    
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const weekStart = now - (7 * 24 * 60 * 60 * 1000);
    
    const todaySessions = sessions.filter(s => s.createdAt > todayStart);
    const weekSessions = sessions.filter(s => s.createdAt > weekStart);
    
    const activeSessions = sessions.filter(s => s.status === "running");
    const completedSessions = sessions.filter(s => s.status === "completed");
    
    // Calculate costs (mock calculation)
    const totalCost = sessions.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);
    const todayCost = todaySessions.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);
    
    return {
      totalAgents: members.length,
      activeAgents: members.filter(m => m.status === "active").length,
      sessionsToday: todaySessions.length,
      sessionsThisWeek: weekSessions.length,
      activeSessions: activeSessions.length,
      completedSessions: completedSessions.length,
      totalCost: Math.round(totalCost * 100) / 100,
      todayCost: Math.round(todayCost * 100) / 100,
      averageSessionTime: sessions.length > 0 ? 
        Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length) : 0,
      successRate: sessions.length > 0 ?
        Math.round((completedSessions.length / sessions.length) * 100) : 100,
    };
  },
});

// Get agent sessions and activity
export const getAgentSessions = query({
  args: {
    agentId: v.optional(v.id("team_members")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { agentId, limit = 50 }) => {
    let query = ctx.db.query("agent_sessions");
    
    if (agentId) {
      query = query.filter((q) => q.eq(q.field("agentId"), agentId));
    }
    
    const sessions = await query.order("desc").take(limit);
    
    // Join with agent data
    const sessionsWithAgent = await Promise.all(
      sessions.map(async (session) => {
        const agent = await ctx.db.get(session.agentId);
        return {
          ...session,
          agent,
        };
      })
    );
    
    return sessionsWithAgent;
  },
});

// Create team member (agent)
export const createTeamMember = mutation({
  args: {
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
    costPerHour: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const memberId = await ctx.db.insert("team_members", {
      ...args,
      status: "active",
      totalSessions: 0,
      totalHours: 0,
      successRate: 100,
      createdAt: now,
      updatedAt: now,
    });

    return memberId;
  },
});

// Update team member status
export const updateTeamMemberStatus = mutation({
  args: {
    memberId: v.id("team_members"),
    status: v.union(
      v.literal("active"),
      v.literal("busy"),
      v.literal("idle"),
      v.literal("maintenance")
    ),
  },
  handler: async (ctx, { memberId, status }) => {
    const now = Date.now();
    
    await ctx.db.patch(memberId, {
      status,
      updatedAt: now,
      ...(status === "active" && { lastActiveAt: now }),
    });

    return memberId;
  },
});

// Create agent session (when spinning up subagent)
export const createAgentSession = mutation({
  args: {
    agentId: v.id("team_members"),
    taskTitle: v.string(),
    taskDescription: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    estimatedDuration: v.optional(v.number()), // in minutes
    estimatedCost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const sessionId = await ctx.db.insert("agent_sessions", {
      ...args,
      status: "running",
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Update team member status to busy
    await ctx.db.patch(args.agentId, {
      status: "busy",
      updatedAt: now,
    });

    return sessionId;
  },
});

// Complete agent session
export const completeAgentSession = mutation({
  args: {
    sessionId: v.id("agent_sessions"),
    status: v.union(
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    result: v.optional(v.string()),
    actualCost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sessionId, status, result, actualCost } = args;
    const now = Date.now();
    
    const session = await ctx.db.get(sessionId);
    if (!session) return null;
    
    const duration = session.startedAt ? now - session.startedAt : 0;
    
    await ctx.db.patch(sessionId, {
      status,
      result,
      actualCost,
      duration: Math.round(duration / 1000 / 60), // minutes
      completedAt: now,
      updatedAt: now,
    });

    // Update team member back to active and increment counters
    const member = await ctx.db.get(session.agentId);
    if (member) {
      await ctx.db.patch(session.agentId, {
        status: "active",
        totalSessions: member.totalSessions + 1,
        totalHours: member.totalHours + (duration / 1000 / 60 / 60),
        updatedAt: now,
      });
    }

    return sessionId;
  },
});