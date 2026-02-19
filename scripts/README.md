# 🏛️ Notion 5-Layer Escalation Dashboard

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
cd /home/kunekune/mission-control-dashboard
npm install
```

### 2. Initialize Notion Dashboard
```bash
npm run notion:init
```

This creates:
- 🏛️ Main dashboard page
- 👥 Team layers database  
- 📊 Sessions tracking database
- 🔄 DISTILL process documentation

### 3. Setup Hourly Sync
```bash
npm run notion:setup
```

This configures:
- ⏰ Cron job (every hour at :00)
- 📝 Logging to `scripts/sync.log`
- 🔄 Automatic data sync from MissionController

### 4. Manual Sync (Testing)
```bash
npm run notion:sync
```

## 📊 Notion Structure

### Main Dashboard
- **Location**: Personal Home > 5段階エスカレーション構造
- **Content**: Overview, DISTILL process, team status
- **Updates**: Hourly sync status

### Team Layers Database
| Field | Type | Description |
|-------|------|-------------|
| Layer | Title | L5: Editor, L4: Writer, etc. |
| Role | Text | 編集長 (魂と戦略) |
| Model | Select | Opus 4.6, Sonnet 4, etc. |
| Status | Select | Active, Busy, Idle, Maintenance |
| Cost/Hour | Number | $0.15, $0.12, etc. |
| Sessions Today | Number | Live count |
| Success Rate | Percent | 99%, 97%, etc. |
| Last Active | Date | Real-time timestamp |

### Sessions Database  
| Field | Type | Description |
|-------|------|-------------|
| Task | Title | Task description |
| Layer | Select | Which layer handled it |
| Status | Select | Running, Completed, Failed |
| Priority | Select | Urgent, High, Medium, Low |
| Duration | Number | Minutes |
| Cost | Number | Actual cost |
| Started/Completed | Date | Timestamps |

## 🔄 DISTILL Process Documentation

Automatic documentation of:
1. **Dump** (L2/DeepSeek) - 情報収集
2. **Identify** (L4/Sonnet) - 構造分析  
3. **Integrate** (L5/Opus) - 価値観注入
4. **Layout** (L3/GLM) - 最終配置

## 📈 Live Metrics

Hourly updates include:
- 👥 Team member status (Active/Busy/Idle)
- 📊 Session counts and success rates
- 💰 Cost tracking per layer
- ⏰ Last activity timestamps
- 🎯 Priority distribution

## 🚨 Monitoring

### Sync Logs
```bash
tail -f scripts/sync.log
```

### Cron Status  
```bash
crontab -l | grep notion
```

### Manual Test
```bash
cd scripts
node convex-to-notion-sync.js
```

## 🔧 Configuration

### Environment Variables
- `NOTION_API_KEY`: Notion integration token
- `CONVEX_URL`: MissionController Convex endpoint

### Database IDs
Stored in: `scripts/notion-db-ids.json`

```json
{
  "dashboard": "page-id",
  "teamLayers": "database-id", 
  "sessions": "database-id",
  "distillProcess": "page-id"
}
```

## 🎯 Usage

1. **View Live Status**: Check Notion dashboard
2. **Monitor Performance**: Review team metrics hourly
3. **Track Sessions**: See real-time agent activity  
4. **Follow DISTILL**: Reference process documentation
5. **Cost Analysis**: Monitor spend by layer

## 🚀 Benefits

- ☁️ **Cloud Access**: View anywhere, anytime
- 📱 **Mobile Ready**: Notion mobile app support
- 👥 **Team Sharing**: Share with stakeholders  
- 📊 **Historical Data**: Automatic archiving
- 🔄 **No Maintenance**: Fully automated sync
- 💰 **Cost Tracking**: Detailed spend analysis

---

**Last Updated**: 2026-02-19
**Status**: Ready for deployment 🎉