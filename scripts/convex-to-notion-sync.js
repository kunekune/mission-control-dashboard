#!/usr/bin/env node

// Convex to Notion Sync Script
// Fetches data from MissionController Convex DB and syncs to Notion
// Runs every hour via cron

const { ConvexHttpClient } = require("convex/browser");
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize clients
const convex = new ConvexHttpClient(process.env.CONVEX_URL || "your-convex-url");
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

// Load database IDs
const dbIdsPath = path.join(__dirname, 'notion-db-ids.json');
let DATABASE_IDS = {};

if (fs.existsSync(dbIdsPath)) {
  DATABASE_IDS = JSON.parse(fs.readFileSync(dbIdsPath, 'utf8'));
} else {
  console.error('❌ Database IDs not found. Run with --init first.');
  process.exit(1);
}

class ConvexNotionSync {
  constructor() {
    this.syncLog = [];
  }

  async syncAll() {
    console.log(`🔄 Starting hourly sync at ${new Date().toLocaleString('ja-JP')}`);
    
    try {
      // Fetch data from Convex
      const convexData = await this.fetchConvexData();
      
      // Sync to Notion
      await this.syncTeamMetrics(convexData.teamMetrics, convexData.teamMembers);
      await this.syncRecentSessions(convexData.sessions);
      await this.updateDashboardStatus();
      
      // Log success
      this.logSync('success', 'All data synced successfully');
      console.log('✅ Hourly sync completed successfully');
      
    } catch (error) {
      this.logSync('error', error.message);
      console.error('❌ Sync failed:', error);
    }
  }

  async fetchConvexData() {
    console.log('📥 Fetching data from Convex...');
    
    try {
      // Simulate API calls (replace with actual Convex API calls)
      const teamMembers = [
        {
          _id: 'l5-editor',
          name: 'L5: Editor',
          role: '編集長 (魂と戦略)',
          aiModel: 'Opus 4.6',
          status: 'active',
          totalSessions: 12,
          successRate: 100,
          costPerHour: 0.15,
          lastActive: Date.now()
        },
        {
          _id: 'l4-writer', 
          name: 'L4: Writer',
          role: '執筆官 (論理と構成)',
          aiModel: 'Sonnet 4',
          status: 'active',
          totalSessions: 28,
          successRate: 99,
          costPerHour: 0.12,
          lastActive: Date.now()
        },
        {
          _id: 'l3-secretary',
          name: 'L3: Secretary', 
          role: '秘書 (実務と実行)',
          aiModel: 'GLM-4.7',
          status: 'busy',
          totalSessions: 45,
          successRate: 97,
          costPerHour: 0.04,
          lastActive: Date.now()
        },
        {
          _id: 'l2-gatekeeper',
          name: 'L2: Gatekeeper',
          role: '門番 (整理と速度)', 
          aiModel: 'DeepSeek V3',
          status: 'active',
          totalSessions: 89,
          successRate: 95,
          costPerHour: 0.02,
          lastActive: Date.now()
        },
        {
          _id: 'l1-engineer',
          name: 'L1: Engineer',
          role: '工兵 (システム操作)',
          aiModel: 'Claude Code',
          status: 'active', 
          totalSessions: 156,
          successRate: 98,
          costPerHour: 0.01,
          lastActive: Date.now()
        }
      ];

      const teamMetrics = {
        totalAgents: 5,
        activeAgents: 4,
        sessionsToday: 23,
        sessionsThisWeek: 156,
        activeSessions: 3,
        completedSessions: 320,
        totalCost: 12.45,
        todayCost: 1.89,
        averageSessionTime: 15,
        successRate: 97
      };

      const sessions = [
        {
          _id: 'session-1',
          taskTitle: 'Blog article final editing',
          agentName: 'L5: Editor',
          status: 'running',
          priority: 'high',
          startedAt: Date.now() - (30 * 60 * 1000), // 30 minutes ago
          duration: null,
          estimatedCost: 0.075
        },
        {
          _id: 'session-2',
          taskTitle: 'Morning briefing generation',
          agentName: 'L3: Secretary',
          status: 'completed',
          priority: 'medium', 
          startedAt: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
          duration: 8,
          actualCost: 0.005
        },
        {
          _id: 'session-3',
          taskTitle: 'Email classification batch',
          agentName: 'L2: Gatekeeper',
          status: 'completed',
          priority: 'low',
          startedAt: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
          duration: 12,
          actualCost: 0.004
        }
      ];

      return { teamMembers, teamMetrics, sessions };
      
    } catch (error) {
      throw new Error(`Failed to fetch Convex data: ${error.message}`);
    }
  }

  async syncTeamMetrics(metrics, teamMembers) {
    console.log('👥 Syncing team metrics...');
    
    try {
      // Find existing team layer pages
      const teamLayersResponse = await notion.databases.query({
        database_id: DATABASE_IDS.teamLayers
      });

      // Update each team member
      for (const member of teamMembers) {
        const existingPage = teamLayersResponse.results.find(page => 
          page.properties['Layer']?.title[0]?.text?.content === member.name
        );

        if (existingPage) {
          await notion.pages.update({
            page_id: existingPage.id,
            properties: {
              'Status': {
                select: {
                  name: this.capitalizeFirst(member.status)
                }
              },
              'Sessions Today': {
                number: Math.floor(member.totalSessions / 7) // Simulate daily sessions
              },
              'Success Rate': {
                number: member.successRate / 100
              },
              'Last Active': {
                date: {
                  start: new Date(member.lastActive).toISOString()
                }
              }
            }
          });
        }
      }

      this.logSync('info', `Updated ${teamMembers.length} team members`);
      
    } catch (error) {
      throw new Error(`Failed to sync team metrics: ${error.message}`);
    }
  }

  async syncRecentSessions(sessions) {
    console.log('📊 Syncing recent sessions...');
    
    try {
      // Clear old sessions (keep only last 24 hours)
      const sessionsResponse = await notion.databases.query({
        database_id: DATABASE_IDS.sessions,
        filter: {
          property: 'Started',
          date: {
            before: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });

      // Delete old sessions
      for (const oldSession of sessionsResponse.results) {
        await notion.pages.update({
          page_id: oldSession.id,
          archived: true
        });
      }

      // Add new/updated sessions
      for (const session of sessions) {
        await notion.pages.create({
          parent: {
            database_id: DATABASE_IDS.sessions
          },
          properties: {
            'Task': {
              title: [
                {
                  text: {
                    content: session.taskTitle
                  }
                }
              ]
            },
            'Layer': {
              select: {
                name: session.agentName
              }
            },
            'Status': {
              select: {
                name: this.capitalizeFirst(session.status)
              }
            },
            'Priority': {
              select: {
                name: this.capitalizeFirst(session.priority)
              }
            },
            'Duration (min)': {
              number: session.duration
            },
            'Cost': {
              number: session.actualCost || session.estimatedCost
            },
            'Started': {
              date: {
                start: new Date(session.startedAt).toISOString()
              }
            },
            'Completed': session.status === 'completed' ? {
              date: {
                start: new Date(session.startedAt + (session.duration * 60 * 1000)).toISOString()
              }
            } : null
          }
        });
      }

      this.logSync('info', `Synced ${sessions.length} sessions`);
      
    } catch (error) {
      throw new Error(`Failed to sync sessions: ${error.message}`);
    }
  }

  async updateDashboardStatus() {
    console.log('📈 Updating dashboard status...');
    
    try {
      // Update the main dashboard page with last sync info
      await notion.pages.update({
        page_id: DATABASE_IDS.dashboard,
        properties: {
          // Note: properties updates depend on the page structure
        }
      });

      // Add status block
      await notion.blocks.children.append({
        block_id: DATABASE_IDS.dashboard,
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `🔄 最終同期: ${new Date().toLocaleString('ja-JP')} | ステータス: 正常`
                  },
                  annotations: {
                    color: 'green'
                  }
                }
              ]
            }
          }
        ]
      });

      this.logSync('info', 'Dashboard status updated');
      
    } catch (error) {
      // Don't fail the whole sync for this
      console.warn('⚠️ Could not update dashboard status:', error.message);
    }
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  logSync(level, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    
    this.syncLog.push(entry);
    
    // Write to log file
    const logPath = path.join(__dirname, 'sync.log');
    const logLine = `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}\n`;
    fs.appendFileSync(logPath, logLine);
  }
}

// Main execution
async function main() {
  const sync = new ConvexNotionSync();
  await sync.syncAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ConvexNotionSync };