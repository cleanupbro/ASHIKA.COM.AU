#!/bin/bash
# ASHIKA Shared Memory Sync Script
# Updates progress.json with current timestamp

set -e

MEMORY_DIR=".shared-memory"
PROGRESS_FILE="$MEMORY_DIR/progress.json"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq not installed. Using basic update."
    # Basic update without jq
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "Updated at: $TIMESTAMP"
    exit 0
fi

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Update progress.json
if [ -f "$PROGRESS_FILE" ]; then
    # Update the last_task.completed_at timestamp
    jq --arg ts "$TIMESTAMP" '.last_task.completed_at = $ts' "$PROGRESS_FILE" > tmp.json && mv tmp.json "$PROGRESS_FILE"
    echo "✅ Synced at $TIMESTAMP"
else
    echo "⚠️  $PROGRESS_FILE not found"
fi
