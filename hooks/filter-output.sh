#!/bin/bash
# PostToolUse hook: truncate verbose Bash outputs to save input tokens.
# Keeps first 50 + last 50 lines for outputs over 200 lines.
# Also strips ANSI escape codes for cleaner context.

input=$(cat)

# Strip ANSI escape codes
cleaned=$(echo "$input" | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g')

lines=$(echo "$cleaned" | wc -l)

if [ "$lines" -gt 200 ]; then
  echo "$cleaned" | head -50
  echo ""
  echo "... ($((lines - 100)) lines truncated) ..."
  echo ""
  echo "$cleaned" | tail -50
else
  echo "$cleaned"
fi
