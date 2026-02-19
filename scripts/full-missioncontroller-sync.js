#!/usr/bin/env node

// MissionController Full Sync to Notion
// Syncs ALL MissionController data (Tasks, Content, Calendar, Memory, Team) to Notion

const { Client } = require('@notionhq/client');
const { ConvexHttpClient } = require("convex/browser");
const fs = require('fs');
const path = require('path');

// Initialize clients
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

const convex = new ConvexHttpClient(process.env.CONVEX_URL || "your-convex-url");

// Parent page for all databases
const PARENT_PAGE_ID = '13eb8c74dbc042c6bc4138450611ffeb'; // Personal Home

class MissionControllerNotionSync {
  constructor() {
    this.databases = {};
    this.syncLog = [];
  }

  async initialize() {
    console.log('🚀 Initializing MissionController → Notion Full Sync...');
    
    try {
      // Create main dashboard page
      const dashboardPage = await this.createMainDashboard();
      
      // Create all databases
      const tasksDb = await this.createTasksDatabase(dashboardPage.id);
      const contentDb = await this.createContentDatabase(dashboardPage.id);
      const calendarDb = await this.createCalendarDatabase(dashboardPage.id);
      const memoryDb = await this.createMemoryDatabase(dashboardPage.id);
      const teamDb = await this.createTeamDatabase(dashboardPage.id);
      
      this.databases = {
        dashboard: dashboardPage.id,
        tasks: tasksDb.id,
        content: contentDb.id,
        calendar: calendarDb.id,
        memory: memoryDb.id,
        team: teamDb.id
      };
      
      // Save database IDs
      fs.writeFileSync(
        path.join(__dirname, 'missioncontroller-notion-dbs.json'),
        JSON.stringify(this.databases, null, 2)
      );
      
      console.log('✅ All MissionController databases created in Notion!');
      return this.databases;
      
    } catch (error) {
      console.error('❌ Error initializing:', error);
      throw error;
    }
  }

  async createMainDashboard() {
    const response = await notion.pages.create({
      parent: {
        page_id: PARENT_PAGE_ID
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: '🎯 MissionController Dashboard'
              }
            }
          ]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '🎯 MissionController Dashboard'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'MissionController全体のデータをNotionで管理・確認できるダッシュボードです。'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'callout',
          callout: {
            icon: {
              emoji: '🔄'
            },
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '1時間毎に自動同期されます。ローカルのMissionControllerが情報源です。'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '最終同期: '
                },
                annotations: {
                  bold: true
                }
              },
              {
                type: 'text',
                text: {
                  content: new Date().toLocaleString('ja-JP')
                }
              }
            ]
          }
        }
      ]
    });

    return response;
  }

  // Tasks Database
  async createTasksDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: '📋 Tasks (タスク管理)'
          }
        }
      ],
      properties: {
        'Task': {
          title: {}
        },
        'Status': {
          select: {
            options: [
              { name: 'To Do', color: 'gray' },
              { name: 'In Progress', color: 'yellow' },
              { name: 'Review', color: 'orange' },
              { name: 'Done', color: 'green' },
              { name: 'Blocked', color: 'red' }
            ]
          }
        },
        'Priority': {
          select: {
            options: [
              { name: 'Urgent', color: 'red' },
              { name: 'High', color: 'orange' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'gray' }
            ]
          }
        },
        'Assignee': {
          rich_text: {}
        },
        'Due Date': {
          date: {}
        },
        'Created': {
          date: {}
        },
        'Description': {
          rich_text: {}
        },
        'Tags': {
          multi_select: {
            options: []
          }
        }
      }
    });

    return response;
  }

  // Content Database  
  async createContentDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: '📝 Content Pipeline (コンテンツ制作)'
          }
        }
      ],
      properties: {
        'Title': {
          title: {}
        },
        'Stage': {
          select: {
            options: [
              { name: 'Ideas', color: 'gray' },
              { name: 'Scripting', color: 'blue' },
              { name: 'Thumbnail', color: 'green' },
              { name: 'Filming', color: 'yellow' },
              { name: 'Editing', color: 'orange' },
              { name: 'Published', color: 'purple' }
            ]
          }
        },
        'Type': {
          select: {
            options: [
              { name: 'Blog Post', color: 'blue' },
              { name: 'Video', color: 'red' },
              { name: 'Social Media', color: 'green' },
              { name: 'Documentation', color: 'gray' }
            ]
          }
        },
        'Due Date': {
          date: {}
        },
        'Created': {
          date: {}
        },
        'Description': {
          rich_text: {}
        },
        'Script': {
          rich_text: {}
        },
        'Files': {
          rich_text: {}
        }
      }
    });

    return response;
  }

  // Calendar Database
  async createCalendarDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: '📅 Calendar (カレンダー・スケジュール)'
          }
        }
      ],
      properties: {
        'Event': {
          title: {}
        },
        'Date': {
          date: {}
        },
        'Type': {
          select: {
            options: [
              { name: 'Meeting', color: 'blue' },
              { name: 'Task', color: 'yellow' },
              { name: 'Deadline', color: 'red' },
              { name: 'Cron Job', color: 'purple' },
              { name: 'Personal', color: 'green' }
            ]
          }
        },
        'Location': {
          rich_text: {}
        },
        'Description': {
          rich_text: {}
        },
        'Attendees': {
          rich_text: {}
        },
        'Status': {
          select: {
            options: [
              { name: 'Scheduled', color: 'blue' },
              { name: 'Confirmed', color: 'green' },
              { name: 'Cancelled', color: 'red' },
              { name: 'Completed', color: 'gray' }
            ]
          }
        }
      }
    });

    return response;
  }

  // Memory Database
  async createMemoryDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: '🧠 Memory (メモリ・ドキュメント)'
          }
        }
      ],
      properties: {
        'Title': {
          title: {}
        },
        'Type': {
          select: {
            options: [
              { name: 'Note', color: 'blue' },
              { name: 'Reference', color: 'green' },
              { name: 'Archive', color: 'gray' },
              { name: 'Active', color: 'yellow' }
            ]
          }
        },
        'Category': {
          select: {
            options: [
              { name: 'Technical', color: 'blue' },
              { name: 'Business', color: 'green' },
              { name: 'Personal', color: 'purple' },
              { name: 'Research', color: 'orange' }
            ]
          }
        },
        'Created': {
          date: {}
        },
        'Updated': {
          date: {}
        },
        'Content': {
          rich_text: {}
        },
        'Tags': {
          multi_select: {
            options: []
          }
        },
        'File Path': {
          rich_text: {}
        }
      }
    });

    return response;
  }

  // Team Database
  async createTeamDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: '👥 Team (チーム・エージェント)'
          }
        }
      ],
      properties: {
        'Name': {
          title: {}
        },
        'Role': {
          rich_text: {}
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Busy', color: 'yellow' },
              { name: 'Idle', color: 'gray' },
              { name: 'Offline', color: 'red' }
            ]
          }
        },
        'AI Model': {
          select: {
            options: [
              { name: 'Claude Opus', color: 'purple' },
              { name: 'Claude Sonnet', color: 'blue' },
              { name: 'GLM-4', color: 'green' },
              { name: 'DeepSeek', color: 'yellow' },
              { name: 'GPT-4', color: 'orange' }
            ]
          }
        },
        'Specialization': {
          multi_select: {
            options: [
              { name: 'Writing', color: 'blue' },
              { name: 'Analysis', color: 'green' },
              { name: 'Coding', color: 'red' },
              { name: 'Planning', color: 'yellow' },
              { name: 'Research', color: 'purple' }
            ]
          }
        },
        'Last Active': {
          date: {}
        },
        'Total Sessions': {
          number: {}
        },
        'Success Rate': {
          number: {
            format: 'percent'
          }
        }
      }
    });

    return response;
  }

  // Main sync function
  async syncAllData() {
    console.log('🔄 Starting full MissionController sync...');
    
    try {
      // Load database IDs
      const dbIds = JSON.parse(fs.readFileSync(
        path.join(__dirname, 'missioncontroller-notion-dbs.json'),
        'utf8'
      ));
      
      // Fetch all data from Convex (simulate for now)
      const allData = await this.fetchConvexData();
      
      // Sync each system
      await this.syncTasks(dbIds.tasks, allData.tasks);
      await this.syncContent(dbIds.content, allData.content);
      await this.syncCalendar(dbIds.calendar, allData.calendar);
      await this.syncMemory(dbIds.memory, allData.memory);
      await this.syncTeam(dbIds.team, allData.team);
      
      // Update dashboard status
      await this.updateDashboardStatus(dbIds.dashboard);
      
      console.log('✅ Full MissionController sync completed!');
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      throw error;
    }
  }

  async fetchConvexData() {
    const { ConvexDataFetcher } = require('./convex-data-fetcher.js');
    const fetcher = new ConvexDataFetcher();
    
    try {
      const data = await fetcher.fetchAllMissionControllerData();
      console.log(`✅ Fetched data at ${data.fetchedAt}`);
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching Convex data:', error);
      throw error;
    }
  }

  async syncTasks(databaseId, tasks) {
    console.log('📋 Syncing tasks...');
    
    // Clear existing tasks
    await this.clearDatabase(databaseId);
    
    // Add new tasks
    for (const task of tasks) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Task': {
            title: [{ text: { content: task.title || 'Untitled Task' } }]
          },
          'Status': {
            select: { name: task.status || 'To Do' }
          },
          'Priority': {
            select: { name: task.priority || 'Medium' }
          },
          'Assignee': {
            rich_text: [{ text: { content: task.assignee || 'Unassigned' } }]
          },
          'Due Date': task.dueDate ? {
            date: { start: task.dueDate }
          } : null,
          'Created': {
            date: { start: task.createdTime ? new Date(task.createdTime).toISOString() : new Date().toISOString() }
          },
          'Description': {
            rich_text: [{ text: { content: task.description || '' } }]
          }
        }
      });
    }
  }

  async syncContent(databaseId, content) {
    console.log('📝 Syncing content...');
    
    await this.clearDatabase(databaseId);
    
    for (const item of content) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Title': {
            title: [{ text: { content: item.title } }]
          },
          'Stage': {
            select: { name: item.stage }
          },
          'Type': {
            select: { name: item.type }
          },
          'Due Date': item.dueDate ? {
            date: { start: item.dueDate }
          } : null,
          'Created': {
            date: { start: item.createdTime ? new Date(item.createdTime).toISOString() : new Date().toISOString() }
          },
          'Description': {
            rich_text: [{ text: { content: item.description || '' } }]
          },
          'Script': {
            rich_text: [{ text: { content: item.script || '' } }]
          },
          'Files': {
            rich_text: [{ text: { content: Array.isArray(item.files) ? item.files.join(', ') : (item.files || '') } }]
          }
        }
      });
    }
  }

  async syncCalendar(databaseId, calendar) {
    console.log('📅 Syncing calendar...');
    
    await this.clearDatabase(databaseId);
    
    for (const event of calendar) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Event': {
            title: [{ text: { content: event.title } }]
          },
          'Date': {
            date: { start: event.date }
          },
          'Type': {
            select: { name: event.type }
          },
          'Location': {
            rich_text: [{ text: { content: event.location || '' } }]
          },
          'Description': {
            rich_text: [{ text: { content: event.description || '' } }]
          },
          'Status': {
            select: { name: event.status }
          }
        }
      });
    }
  }

  async syncMemory(databaseId, memory) {
    console.log('🧠 Syncing memory...');
    
    await this.clearDatabase(databaseId);
    
    for (const item of memory) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Title': {
            title: [{ text: { content: item.title } }]
          },
          'Type': {
            select: { name: item.type }
          },
          'Category': {
            select: { name: item.category }
          },
          'Created': {
            date: { start: new Date().toISOString() }
          },
          'Updated': {
            date: { start: new Date().toISOString() }
          },
          'Content': {
            rich_text: [{ text: { content: item.content } }]
          },
          'File Path': {
            rich_text: [{ text: { content: item.filePath || '' } }]
          }
        }
      });
    }
  }

  async syncTeam(databaseId, team) {
    console.log('👥 Syncing team...');
    
    await this.clearDatabase(databaseId);
    
    for (const member of team) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Name': {
            title: [{ text: { content: member.name } }]
          },
          'Role': {
            rich_text: [{ text: { content: member.role } }]
          },
          'Status': {
            select: { name: member.status }
          },
          'AI Model': {
            select: { name: member.aiModel }
          },
          'Last Active': {
            date: { start: member.lastActive }
          },
          'Total Sessions': {
            number: member.totalSessions
          },
          'Success Rate': {
            number: member.successRate
          }
        }
      });
    }
  }

  async clearDatabase(databaseId) {
    const response = await notion.databases.query({
      database_id: databaseId
    });
    
    for (const page of response.results) {
      await notion.pages.update({
        page_id: page.id,
        archived: true
      });
    }
  }

  async updateDashboardStatus(dashboardId) {
    await notion.blocks.children.append({
      block_id: dashboardId,
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
  }
}

// Main execution
async function main() {
  const sync = new MissionControllerNotionSync();
  
  if (process.argv.includes('--init')) {
    // Initialize all databases
    const result = await sync.initialize();
    console.log('📊 MissionController databases created:', result);
    
  } else {
    // Regular sync
    await sync.syncAllData();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MissionControllerNotionSync };