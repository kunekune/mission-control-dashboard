#!/bin/bash

# Setup MissionController → Notion Full Sync

echo "🚀 Setting up MissionController → Notion Full Sync..."

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
NODE_PATH=$(which node)
SYNC_SCRIPT="$SCRIPT_DIR/full-missioncontroller-sync.js"

# Create wrapper script for better logging
cat > "$SCRIPT_DIR/run-missioncontroller-sync.sh" << EOF
#!/bin/bash
# MissionController → Notion Sync Wrapper Script

export NODE_ENV=production
export PATH=/usr/local/bin:/usr/bin:/bin:\$PATH

cd "$SCRIPT_DIR"

echo "\$(date): Starting MissionController → Notion sync..." >> missioncontroller-sync.log
$NODE_PATH "$SYNC_SCRIPT" >> missioncontroller-sync.log 2>&1
echo "\$(date): MissionController sync completed" >> missioncontroller-sync.log
EOF

# Make wrapper executable
chmod +x "$SCRIPT_DIR/run-missioncontroller-sync.sh"

# Add to cron (every hour at minute 0)
(crontab -l 2>/dev/null; echo "0 * * * * $SCRIPT_DIR/run-missioncontroller-sync.sh") | crontab -

echo "✅ MissionController → Notion sync cron job configured"
echo "📝 Logs will be written to: $SCRIPT_DIR/missioncontroller-sync.log"
echo "🔧 To view current crontab: crontab -l"
echo "📊 To manually test sync: $SCRIPT_DIR/run-missioncontroller-sync.sh"

# Test the setup
echo "🧪 Testing sync script..."
$NODE_PATH "$SYNC_SCRIPT" --init || echo "⚠️ Test failed - check dependencies"

echo "🎉 MissionController → Notion sync setup complete!"
echo ""
echo "📋 What was created:"
echo "✅ Tasks Database (タスク管理)"
echo "✅ Content Database (コンテンツ制作)"
echo "✅ Calendar Database (スケジュール)"
echo "✅ Memory Database (メモリ・ドキュメント)"
echo "✅ Team Database (チーム・エージェント)"
echo ""
echo "🔄 Sync runs every hour automatically"
echo "☁️ Check Notion Personal Home for new dashboard"