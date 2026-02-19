#!/bin/bash

# Setup hourly cron job for Notion sync

echo "🚀 Setting up Notion 5-Layer Escalation sync cron job..."

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
NODE_PATH=$(which node)
SYNC_SCRIPT="$SCRIPT_DIR/convex-to-notion-sync.js"

# Create wrapper script for better logging
cat > "$SCRIPT_DIR/run-notion-sync.sh" << EOF
#!/bin/bash
# Notion Sync Wrapper Script

export NODE_ENV=production
export PATH=/usr/local/bin:/usr/bin:/bin:\$PATH

cd "$SCRIPT_DIR"

echo "\$(date): Starting Notion sync..." >> sync.log
$NODE_PATH "$SYNC_SCRIPT" >> sync.log 2>&1
echo "\$(date): Notion sync completed" >> sync.log
EOF

# Make wrapper executable
chmod +x "$SCRIPT_DIR/run-notion-sync.sh"

# Add to cron (every hour at minute 0)
(crontab -l 2>/dev/null; echo "0 * * * * $SCRIPT_DIR/run-notion-sync.sh") | crontab -

echo "✅ Cron job configured to run every hour"
echo "📝 Logs will be written to: $SCRIPT_DIR/sync.log"
echo "🔧 To view current crontab: crontab -l"
echo "📊 To manually test sync: $SCRIPT_DIR/run-notion-sync.sh"

# Test the setup
echo "🧪 Testing sync script..."
$NODE_PATH "$SYNC_SCRIPT" --test || echo "⚠️ Test failed - check dependencies"

echo "🎉 Setup complete!"