import { mutation } from "./_generated/server";

// Initialize the AI team with default members
export const initializeTeam = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Check if team already initialized
    const existingMembers = await ctx.db.query("team_members").collect();
    if (existingMembers.length > 0) {
      return { message: "Team already initialized", count: existingMembers.length };
    }
    
    const teamMembers = [
      {
        name: "L5: Editor",
        role: "編集長 (魂と戦略)", 
        aiModel: "Opus 4.6",
        hierarchyLevel: "lead" as const,
        specialties: ["ブログ最終仕上げ", "人生相談", "複雑な感情の機微", "日記の人生洞察への昇華"],
        description: "最高レベルの戦略的思考と感情理解。ブログの最終仕上げ、人生相談、複雑な感情の機微を読み取る返信、日記の「人生の洞察」への昇華を担当。",
        avatar: "🏛️",
        color: "#8b5cf6", // Purple - 最高位
        status: "active" as const,
        costPerHour: 0.15,
        totalSessions: 0,
        totalHours: 0,
        successRate: 100,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "L4: Writer",
        role: "執筆官 (論理と構成)",
        aiModel: "Sonnet 4",
        hierarchyLevel: "senior" as const,
        specialties: ["記事初稿作成", "高度ビジネスメール", "PARA構成整理", "プログラム設計"],
        description: "論理的構成と高品質な執筆を担当。記事の初稿作成、高度なビジネスメール、PARA構成の整理、プログラムの設計を実行。",
        avatar: "✍️",
        color: "#3b82f6", // Blue
        status: "active" as const,
        costPerHour: 0.12,
        totalSessions: 0,
        totalHours: 0,
        successRate: 99,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "L3: Secretary",
        role: "秘書 (実務と実行)",
        aiModel: "GLM-4.7",
        hierarchyLevel: "specialist" as const,
        specialties: ["カレンダー連携", "Gmail操作", "朝のブリーフィング", "スケジュール調整"],
        description: "日常業務の実行を担当。カレンダー連携、Gmail操作、朝のブリーフィング、スケジュール調整など実務レベルのタスクを処理。",
        avatar: "📋",
        color: "#10b981", // Green
        status: "active" as const,
        costPerHour: 0.04,
        totalSessions: 0,
        totalHours: 0,
        successRate: 97,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "L2: Gatekeeper",
        role: "門番 (整理と速度)",
        aiModel: "DeepSeek V3",
        hierarchyLevel: "specialist" as const,
        specialties: ["日常チャット", "タスク一次分類", "大量メール要約", "日記素材構造化"],
        description: "情報の整理と高速処理を担当。日常チャット、タスクの一次分類、大量メールの要約、「日記の素材」の構造化を実行。",
        avatar: "🚪",
        color: "#f59e0b", // Yellow
        status: "active" as const,
        costPerHour: 0.02,
        totalSessions: 0,
        totalHours: 0,
        successRate: 95,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "L1: Engineer",
        role: "工兵 (システム操作)",
        aiModel: "Claude Code",
        hierarchyLevel: "support" as const,
        specialties: ["ファイル整理", "スクリプト実行", "API検証", "システム操作"],
        description: "システムレベルの操作を担当。PC内のファイル整理、スクリプト実行、APIの捏造がないかの実地検証、基本的なシステム操作を実行。",
        avatar: "🔧",
        color: "#ef4444", // Red
        status: "active" as const,
        costPerHour: 0.01,
        totalSessions: 0,
        totalHours: 0,
        successRate: 98,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Insert all team members
    const memberIds = await Promise.all(
      teamMembers.map(member => ctx.db.insert("team_members", member))
    );
    
    return { 
      message: "Team initialized successfully", 
      count: memberIds.length,
      members: memberIds 
    };
  },
});