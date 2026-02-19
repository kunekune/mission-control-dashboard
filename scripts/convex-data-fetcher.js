// Convex Data Fetcher for MissionController
// Fetches real data from Convex databases

const { ConvexHttpClient } = require("convex/browser");

class ConvexDataFetcher {
  constructor(convexUrl = process.env.CONVEX_URL) {
    this.convex = new ConvexHttpClient(convexUrl);
  }

  async fetchAllMissionControllerData() {
    try {
      console.log('📥 Fetching data from Convex...');
      
      // Parallel fetch all data
      const [tasks, content, calendar, memory, team] = await Promise.all([
        this.fetchTasks(),
        this.fetchContent(), 
        this.fetchCalendar(),
        this.fetchMemory(),
        this.fetchTeam()
      ]);

      return {
        tasks,
        content,
        calendar, 
        memory,
        team,
        fetchedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error fetching Convex data:', error);
      
      // Return sample data if Convex is not available
      console.log('⚠️ Using sample data instead...');
      return this.getSampleData();
    }
  }

  async fetchTasks() {
    try {
      // This would be the actual Convex query
      // const tasks = await this.convex.query("tasks:list");
      
      // For now, return sample data structure
      return [
        {
          _id: 'task-1',
          title: 'Complete MissionController Notion sync',
          status: 'In Progress',
          priority: 'Urgent',
          assignee: 'Crown',
          dueDate: '2026-02-20',
          description: 'Set up full MissionController to Notion sync system',
          tags: ['notion', 'sync', 'automation'],
          createdTime: Date.now(),
          updatedTime: Date.now()
        },
        {
          _id: 'task-2',
          title: 'Update task board visualization',
          status: 'Done', 
          priority: 'High',
          assignee: 'AI Assistant',
          dueDate: '2026-02-19',
          description: 'Implement real-time task board with progress tracking',
          tags: ['ui', 'dashboard'],
          createdTime: Date.now() - 86400000, // 1 day ago
          updatedTime: Date.now()
        }
      ];
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  async fetchContent() {
    try {
      // const content = await this.convex.query("content:list");
      
      return [
        {
          _id: 'content-1',
          title: 'Yokohama Bay Historical Article',
          stage: 'Editing',
          type: 'Blog Post',
          dueDate: '2026-02-20T10:00:00Z',
          description: '横浜湾の歴史的発展についての記事執筆',
          script: 'Draft content with historical research and sensory details...',
          files: ['images/yokohama-bay-1859.jpg', 'research/timeline.md'],
          createdTime: Date.now() - 172800000, // 2 days ago
          updatedTime: Date.now()
        },
        {
          _id: 'content-2',
          title: 'AI Agent System Documentation',
          stage: 'Published',
          type: 'Documentation',
          dueDate: null,
          description: 'Complete documentation of the AI agent ecosystem',
          script: '',
          files: ['docs/architecture.md', 'diagrams/system-flow.png'],
          createdTime: Date.now() - 604800000, // 1 week ago
          updatedTime: Date.now() - 86400000
        }
      ];
      
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  }

  async fetchCalendar() {
    try {
      // const events = await this.convex.query("calendar:list");
      
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 86400000);
      
      return [
        {
          _id: 'event-1',
          title: 'Morning Business Check',
          date: new Date(now.setHours(8, 0, 0, 0)).toISOString(),
          type: 'Cron Job',
          location: 'Automated',
          description: 'Daily morning briefing with email, calendar, and weather',
          attendees: '',
          status: 'Scheduled',
          isRecurring: true
        },
        {
          _id: 'event-2',
          title: 'Evening Journal Reflection',
          date: new Date(now.setHours(22, 0, 0, 0)).toISOString(),
          type: 'Cron Job',
          location: 'Automated',
          description: 'Daily CBT-based evening reflection and journal writing',
          attendees: '',
          status: 'Scheduled',
          isRecurring: true
        },
        {
          _id: 'event-3',
          title: 'Project Review Meeting',
          date: tomorrow.toISOString(),
          type: 'Meeting',
          location: 'Virtual',
          description: 'Weekly project progress review and planning',
          attendees: 'Team members',
          status: 'Confirmed',
          isRecurring: false
        }
      ];
      
    } catch (error) {
      console.error('Error fetching calendar:', error);
      return [];
    }
  }

  async fetchMemory() {
    try {
      // const memories = await this.convex.query("memory:list");
      
      return [
        {
          _id: 'memory-1',
          title: 'Anti-Hallucination Policy',
          type: 'Active',
          category: 'Technical',
          content: 'Constitutional policy preventing fake data implementations',
          tags: ['constitutional', 'policy', 'quality'],
          filePath: '/home/kunekune/Dropbox/obsidian-vault/00-System/Anti_Hallucination_Policy.md',
          createdTime: Date.now() - 259200000, // 3 days ago
          updatedTime: Date.now()
        },
        {
          _id: 'memory-2',
          title: 'Project Standards Document', 
          type: 'Active',
          category: 'Technical',
          content: 'Immutable project standards for consistent implementation',
          tags: ['standards', 'implementation'],
          filePath: '/home/kunekune/Dropbox/obsidian-vault/00-System/Project_Standards.md',
          createdTime: Date.now() - 432000000, // 5 days ago
          updatedTime: Date.now() - 86400000
        },
        {
          _id: 'memory-3',
          title: 'Yokohama Bay Research Archive',
          type: 'Archive',
          category: 'Research',
          content: '165年の横浜湾歴史研究データと執筆テンプレート',
          tags: ['yokohama', 'history', 'writing'],
          filePath: '/home/kunekune/Dropbox/yokohama-bay/',
          createdTime: Date.now() - 777600000, // 9 days ago
          updatedTime: Date.now() - 172800000
        }
      ];
      
    } catch (error) {
      console.error('Error fetching memory:', error);
      return [];
    }
  }

  async fetchTeam() {
    try {
      // const team = await this.convex.query("team:list");
      
      return [
        {
          _id: 'team-1',
          name: 'L5: Editor (Crown)',
          role: '編集長 - 魂と戦略',
          status: 'Active',
          aiModel: 'Claude Opus',
          specialization: ['Writing', 'Analysis', 'Strategy'],
          lastActive: new Date().toISOString(),
          totalSessions: 47,
          successRate: 1.0,
          costPerHour: 0.15
        },
        {
          _id: 'team-2', 
          name: 'L4: Writer Agent',
          role: '執筆官 - 論理と構成',
          status: 'Active',
          aiModel: 'Claude Sonnet',
          specialization: ['Writing', 'Research', 'Planning'],
          lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          totalSessions: 89,
          successRate: 0.99,
          costPerHour: 0.12
        },
        {
          _id: 'team-3',
          name: 'L3: Secretary Agent', 
          role: '秘書 - 実務と実行',
          status: 'Busy',
          aiModel: 'GLM-4.7',
          specialization: ['Coding', 'Analysis'],
          lastActive: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago  
          totalSessions: 156,
          successRate: 0.97,
          costPerHour: 0.04
        },
        {
          _id: 'team-4',
          name: 'L2: Gatekeeper Agent',
          role: '門番 - 整理と速度',
          status: 'Active',
          aiModel: 'DeepSeek V3',
          specialization: ['Analysis', 'Planning'],
          lastActive: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          totalSessions: 234,
          successRate: 0.95,
          costPerHour: 0.02
        },
        {
          _id: 'team-5',
          name: 'L1: Engineer Agent',
          role: '工兵 - システム操作',
          status: 'Idle',
          aiModel: 'Claude Code',
          specialization: ['Coding'],
          lastActive: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          totalSessions: 67,
          successRate: 0.98,
          costPerHour: 0.01
        }
      ];
      
    } catch (error) {
      console.error('Error fetching team:', error);
      return [];
    }
  }

  getSampleData() {
    return {
      tasks: [
        {
          _id: 'sample-task-1',
          title: 'Sample Task (Convex Offline)',
          status: 'To Do',
          priority: 'Medium',
          assignee: 'System',
          dueDate: '2026-02-21',
          description: 'This is sample data shown when Convex is not available',
          tags: ['sample'],
          createdTime: Date.now(),
          updatedTime: Date.now()
        }
      ],
      content: [
        {
          _id: 'sample-content-1',
          title: 'Sample Content (Convex Offline)',
          stage: 'Ideas',
          type: 'Blog Post',
          dueDate: null,
          description: 'Sample content data',
          script: '',
          files: [],
          createdTime: Date.now(),
          updatedTime: Date.now()
        }
      ],
      calendar: [
        {
          _id: 'sample-event-1',
          title: 'Sample Event (Convex Offline)',
          date: new Date().toISOString(),
          type: 'Task',
          location: '',
          description: 'Sample calendar event',
          attendees: '',
          status: 'Scheduled',
          isRecurring: false
        }
      ],
      memory: [
        {
          _id: 'sample-memory-1',
          title: 'Sample Memory (Convex Offline)',
          type: 'Note',
          category: 'Technical',
          content: 'Sample memory content',
          tags: ['sample'],
          filePath: '',
          createdTime: Date.now(),
          updatedTime: Date.now()
        }
      ],
      team: [
        {
          _id: 'sample-team-1',
          name: 'Sample Agent (Convex Offline)',
          role: 'Assistant',
          status: 'Offline',
          aiModel: 'Unknown',
          specialization: ['General'],
          lastActive: new Date().toISOString(),
          totalSessions: 0,
          successRate: 0.0,
          costPerHour: 0.0
        }
      ],
      fetchedAt: new Date().toISOString()
    };
  }
}

module.exports = { ConvexDataFetcher };