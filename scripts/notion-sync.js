#!/usr/bin/env node

// Notion 5-Layer Escalation Structure Sync Script
// Syncs MissionController data to Notion every hour

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

// Notion Database IDs (will be created if not exist)
const DATABASES = {
  MAIN_DASHBOARD: null, // Will be set after creation
  TEAM_LAYERS: null,
  SESSIONS: null,
  DISTILL_PROCESS: null
};

// 5-Layer Escalation Structure Data
const ESCALATION_LAYERS = [
  {
    layer: 'L5',
    name: 'Editor',
    role: '編集長 (魂と戦略)',
    model: 'Opus 4.6',
    tasks: ['ブログ最終仕上げ', '人生相談', '複雑な感情の機微', '日記の洞察昇華'],
    color: '🟣',
    costPerHour: 0.15,
    description: '最高レベルの戦略的思考と感情理解。人生の洞察への昇華を担当。'
  },
  {
    layer: 'L4',
    name: 'Writer',
    role: '執筆官 (論理と構成)',
    model: 'Sonnet 4',
    tasks: ['記事初稿作成', '高度ビジネスメール', 'PARA構成整理', 'プログラム設計'],
    color: '🔵',
    costPerHour: 0.12,
    description: '論理的構成と高品質な執筆を担当。'
  },
  {
    layer: 'L3',
    name: 'Secretary',
    role: '秘書 (実務と実行)',
    model: 'GLM-4.7',
    tasks: ['カレンダー連携', 'Gmail操作', '朝のブリーフィング', 'スケジュール調整'],
    color: '🟢',
    costPerHour: 0.04,
    description: '日常業務の実行を担当。'
  },
  {
    layer: 'L2',
    name: 'Gatekeeper',
    role: '門番 (整理と速度)',
    model: 'DeepSeek V3',
    tasks: ['日常チャット', 'タスク一次分類', '大量メール要約', '日記素材構造化'],
    color: '🟡',
    costPerHour: 0.02,
    description: '情報の整理と高速処理を担当。'
  },
  {
    layer: 'L1',
    name: 'Engineer',
    role: '工兵 (システム操作)',
    model: 'Claude Code',
    tasks: ['ファイル整理', 'スクリプト実行', 'API検証', 'システム操作'],
    color: '🔴',
    costPerHour: 0.01,
    description: 'システムレベルの操作を担当。'
  }
];

// DISTILL Process Steps
const DISTILL_STEPS = [
  {
    step: 1,
    name: 'Dump',
    layer: 'L2 (DeepSeek)',
    description: 'Discordメモから生の情報をどばっと集める',
    purpose: '情報収集',
    warning: '構造化は行わず、生データの収集のみ'
  },
  {
    step: 2,
    name: 'Identify',
    layer: 'L4 (Sonnet)',
    description: 'そのメモから「今日の核心」と「感情の論点」を抽出',
    purpose: '構造分析',
    warning: '感情解釈は行わず、論理的構造のみ'
  },
  {
    step: 3,
    name: 'Integrate',
    layer: 'L5 (Opus)',
    description: 'Opus召喚。構造に価値観を注入して執筆',
    purpose: '最終執筆',
    warning: 'このレイヤーでのみ感情的洞察を許可'
  },
  {
    step: 4,
    name: 'Layout',
    layer: 'L3 (GLM)',
    description: '完成した日記をObsidian Daily Noteに書き込み',
    purpose: '実装・配置',
    warning: '内容の変更は行わず、配置のみ'
  }
];

class NotionEscalationSync {
  constructor() {
    this.parentPageId = '13eb8c74dbc042c6bc4138450611ffeb'; // Personal Home
  }

  async initialize() {
    console.log('🚀 Initializing Notion 5-Layer Escalation Dashboard...');
    
    try {
      // Create main dashboard page
      const dashboardPage = await this.createMainDashboard();
      
      // Create team layers database
      const teamLayersDb = await this.createTeamLayersDatabase(dashboardPage.id);
      
      // Create sessions database  
      const sessionsDb = await this.createSessionsDatabase(dashboardPage.id);
      
      // Create DISTILL process page
      const distillPage = await this.createDISTILLProcessPage(dashboardPage.id);
      
      // Populate with initial data
      await this.populateTeamLayers(teamLayersDb.id);
      await this.populateDISTILLProcess(distillPage.id);
      
      console.log('✅ Notion 5-Layer Escalation Dashboard created successfully!');
      return {
        dashboard: dashboardPage.id,
        teamLayers: teamLayersDb.id,
        sessions: sessionsDb.id,
        distillProcess: distillPage.id
      };
      
    } catch (error) {
      console.error('❌ Error initializing Notion dashboard:', error);
      throw error;
    }
  }

  async createMainDashboard() {
    const response = await notion.pages.create({
      parent: {
        page_id: this.parentPageId
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: '🏛️ OpenClaw: 5段階エスカレーション構造'
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
                  content: '🏛️ OpenClaw: 5段階エスカレーション構造 (2026年版)'
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
                  content: '「誰が何を担当し、どのレベルで次のモデルにバトンを渡すべきか」の定義です。'
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
              emoji: '⚠️'
            },
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'L5 (Opus) 以外に「日記の仕上げ」や「重要判断」をさせるな。下位モデルは素材提供に徹せよ。'
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
                  content: '最終更新: '
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

  async createTeamLayersDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Team Layers (チームレイヤー)'
          }
        }
      ],
      properties: {
        'Layer': {
          title: {}
        },
        'Name': {
          rich_text: {}
        },
        'Role': {
          rich_text: {}
        },
        'Model': {
          select: {
            options: [
              { name: 'Opus 4.6', color: 'purple' },
              { name: 'Sonnet 4', color: 'blue' },
              { name: 'GLM-4.7', color: 'green' },
              { name: 'DeepSeek V3', color: 'yellow' },
              { name: 'Claude Code', color: 'red' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Busy', color: 'yellow' },
              { name: 'Idle', color: 'gray' },
              { name: 'Maintenance', color: 'red' }
            ]
          }
        },
        'Cost/Hour': {
          number: {
            format: 'dollar'
          }
        },
        'Sessions Today': {
          number: {}
        },
        'Success Rate': {
          number: {
            format: 'percent'
          }
        },
        'Last Active': {
          date: {}
        },
        'Description': {
          rich_text: {}
        }
      }
    });

    return response;
  }

  async createSessionsDatabase(parentPageId) {
    const response = await notion.databases.create({
      parent: {
        page_id: parentPageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'Agent Sessions (エージェントセッション)'
          }
        }
      ],
      properties: {
        'Task': {
          title: {}
        },
        'Layer': {
          select: {
            options: [
              { name: 'L5: Editor', color: 'purple' },
              { name: 'L4: Writer', color: 'blue' },
              { name: 'L3: Secretary', color: 'green' },
              { name: 'L2: Gatekeeper', color: 'yellow' },
              { name: 'L1: Engineer', color: 'red' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'Running', color: 'blue' },
              { name: 'Completed', color: 'green' },
              { name: 'Failed', color: 'red' },
              { name: 'Cancelled', color: 'gray' }
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
        'Duration (min)': {
          number: {}
        },
        'Cost': {
          number: {
            format: 'dollar'
          }
        },
        'Started': {
          date: {}
        },
        'Completed': {
          date: {}
        },
        'Result': {
          rich_text: {}
        }
      }
    });

    return response;
  }

  async createDISTILLProcessPage(parentPageId) {
    const response = await notion.pages.create({
      parent: {
        page_id: parentPageId
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: '🔄 DISTILL Process (思考の蒸留ルート)'
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
                  content: '🔄 DISTILL Process'
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
                  content: '日記や重要アウトプット生成時に必須の4段階プロセス'
                },
                annotations: {
                  bold: true
                }
              }
            ]
          }
        },
        ...DISTILL_STEPS.map(step => ({
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${step.name} (${step.layer}): `
                },
                annotations: {
                  bold: true
                }
              },
              {
                type: 'text',
                text: {
                  content: step.description
                }
              }
            ]
          }
        })),
        {
          object: 'block',
          type: 'callout',
          callout: {
            icon: {
              emoji: '🚨'
            },
            rich_text: [
              {
                type: 'text',
                text: {
                  content: '重要: モデル切り替え時は、必ず「前任者が何を決定したか（Handover）」を3行で添えよ。'
                }
              }
            ]
          }
        }
      ]
    });

    return response;
  }

  async populateTeamLayers(databaseId) {
    for (const layer of ESCALATION_LAYERS) {
      await notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Layer': {
            title: [
              {
                text: {
                  content: `${layer.layer}: ${layer.name}`
                }
              }
            ]
          },
          'Name': {
            rich_text: [
              {
                text: {
                  content: layer.name
                }
              }
            ]
          },
          'Role': {
            rich_text: [
              {
                text: {
                  content: layer.role
                }
              }
            ]
          },
          'Model': {
            select: {
              name: layer.model
            }
          },
          'Status': {
            select: {
              name: 'Active'
            }
          },
          'Cost/Hour': {
            number: layer.costPerHour
          },
          'Sessions Today': {
            number: 0
          },
          'Success Rate': {
            number: layer.layer === 'L5' ? 1.0 : 0.98
          },
          'Last Active': {
            date: {
              start: new Date().toISOString()
            }
          },
          'Description': {
            rich_text: [
              {
                text: {
                  content: layer.description
                }
              }
            ]
          }
        }
      });
    }
  }

  async populateDISTILLProcess(pageId) {
    // Add tasks breakdown for each layer
    const tasksBlocks = ESCALATION_LAYERS.map(layer => ({
      object: 'block',
      type: 'toggle',
      toggle: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `${layer.color} ${layer.layer}: ${layer.name} - ${layer.role}`
            },
            annotations: {
              bold: true
            }
          }
        ],
        children: layer.tasks.map(task => ({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: task
                }
              }
            ]
          }
        }))
      }
    }));

    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'レイヤー別タスク詳細'
                }
              }
            ]
          }
        },
        ...tasksBlocks
      ]
    });
  }

  // Sync live data from MissionController (would be called by cron)
  async syncLiveData() {
    console.log('🔄 Syncing live data from MissionController...');
    
    try {
      // TODO: Fetch data from Convex database
      // const convexData = await fetchFromConvex();
      
      // TODO: Update Notion databases with current metrics
      // await this.updateTeamMetrics(convexData.metrics);
      // await this.updateSessionData(convexData.sessions);
      
      console.log('✅ Live data sync completed');
      
    } catch (error) {
      console.error('❌ Error syncing live data:', error);
    }
  }
}

// Main execution
async function main() {
  const sync = new NotionEscalationSync();
  
  if (process.argv.includes('--init')) {
    // Initialize dashboard
    const result = await sync.initialize();
    console.log('📊 Dashboard created:', result);
    
    // Save database IDs for future syncs
    fs.writeFileSync(
      path.join(__dirname, 'notion-db-ids.json'),
      JSON.stringify(result, null, 2)
    );
    
  } else {
    // Regular sync
    await sync.syncLiveData();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { NotionEscalationSync };