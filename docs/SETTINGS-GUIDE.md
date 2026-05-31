# Settings Guide

A field-by-field explanation of every section in `settings.json`.

---

## `env` — Token Optimization Environment Variables

These variables control Claude's behavior at the session level.

### `MAX_THINKING_TOKENS`
```json
"MAX_THINKING_TOKENS": "10000"
```
Caps Claude's extended thinking mode at 10,000 tokens. Extended thinking is Claude's internal "chain of thought" reasoning — powerful for complex problems, expensive for simple ones.

- **Remove this** for deep architecture sessions or complex debugging where you want full reasoning depth
- **Lower to 5000** for routine coding tasks to save tokens
- **Keep at 10000** as a sensible default that allows real reasoning without runaway costs

### `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`
```json
"CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
```
Context compaction fires at 50% capacity instead of the default ~80%.

- **Why 50%**: Compacting earlier means the summary has more room to be comprehensive. At 80%, the context is cramped and important nuance gets dropped.
- **Tune to 70%** if you find compaction happening too frequently on short sessions
- **Leave at 50%** for long multi-file sessions

### `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`
```json
"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
```
Disables telemetry and background network requests from Claude Code.

- **Effect**: Slight latency improvement, removes background pings
- **Set to "0" or remove** if you want full telemetry (for bug reporting, etc.)

---

## `permissions` — What Claude Can Do Without Asking

### `allow` — Auto-approved actions

Each entry follows the pattern `"Bash(command *)"` to allow that command with any arguments, or `"Tool"` to allow a whole tool type.

```json
"allow": [
  "Bash(npm run *)",     // Any npm script
  "Bash(pnpm *)",        // Any pnpm command
  "Bash(git diff *)",    // Read-only git operations
  "Bash(git status)",
  "Bash(git log *)",
  "Bash(git branch *)",
  "Bash(ls *)",          // Directory listing
  "Bash(find *)",        // File search
  "Bash(cat *)",         // File reading
  "Bash(grep *)",        // Text search
  "Bash(python3 *)",     // Python scripts
  "Bash(node *)",        // Node.js
  "Bash(docker ps *)",   // Read-only Docker
  "Edit",                // Allow all file edits
  "Read",                // Allow all file reads
  "Write",               // Allow all file writes
  "Glob",                // File glob patterns
  "Grep",                // Grep tool
  "Agent",               // Spawn subagents
  "Skill"                // Invoke skills
]
```

**Add to this list**: anything you type `yes` to repeatedly in your workflow. Common additions:
```json
"Bash(cargo *)",         // Rust
"Bash(go *)",            // Go
"Bash(pytest *)",        // Python testing
"Bash(make *)",          // Make targets
"mcp__github__*",        // All GitHub MCP operations
"mcp__ollama__*"         // All Ollama MCP operations
```

### `deny` — Blocked regardless of other rules

```json
"deny": [
  "Bash(rm -rf *)",   // Never auto-delete recursively
  "Bash(sudo *)",     // Never auto-elevate
  "Read(.env)",       // Never auto-read secrets
  "Read(.env.*)"      // Never auto-read .env variants
]
```

Deny rules override allow rules. Keep these conservative — they're your safety net.

**Consider adding**:
```json
"Bash(git push --force *)",  // Never force-push without asking
"Bash(git reset --hard *)"   // Never hard-reset without asking
```

### `defaultMode`
```json
"defaultMode": "plan"
```

- **`"plan"`**: Claude proposes a plan before taking action on multi-step tasks. Recommended for production codebases — it forces Claude to articulate what it's about to do before touching files.
- **`"auto"`**: Claude acts immediately. Better for rapid experimentation or when you trust Claude's judgment on your codebase.

---

## `hooks` — Automated Actions on Tool Events

### PostToolUse — Output Truncation

```json
"PostToolUse": [
  {
    "matcher": "Bash",
    "hooks": [{ "type": "command", "command": "~/.claude/hooks/filter-output.sh" }]
  }
]
```

Fires after every Bash command. The script receives the command output on stdin, processes it, and writes to stdout. Claude sees only what the hook outputs.

**To add more PostToolUse hooks**, add more entries to the `hooks` array:
```json
{
  "matcher": "Bash",
  "hooks": [
    { "type": "command", "command": "~/.claude/hooks/filter-output.sh" },
    { "type": "command", "command": "~/.claude/hooks/log-commands.sh" }
  ]
}
```

### Stop Hook (optional)

Runs when Claude finishes a session. Useful for cleanup, memory consolidation, or notifications:
```json
"Stop": [
  {
    "hooks": [{ "type": "command", "command": "~/scripts/session-end.sh" }]
  }
]
```

---

## `mcpServers` — Model Context Protocol Servers

MCP servers extend Claude with external tools and data sources. Each server runs as a local process that Claude can call during a session.

### Ollama (local model routing)
```json
"ollama": {
  "command": "/path/to/venv/bin/python3",
  "args": ["/path/to/ollama-mcp-server/server.py"],
  "env": { "OLLAMA_URL": "http://localhost:11434" }
}
```
Connects Claude to a local Ollama server for token-efficient structured extraction. See [docs/MCP-SETUP.md](MCP-SETUP.md).

### Adding New MCP Servers

Pattern for any MCP server:
```json
"my-server": {
  "command": "npx",              // or "node", "python3", etc.
  "args": ["-y", "@org/server"], // server package or file path
  "env": {
    "API_KEY": "YOUR_KEY"        // server-specific env vars
  }
}
```

Popular MCP servers:
- `@modelcontextprotocol/server-github` — GitHub API
- `@modelcontextprotocol/server-filesystem` — File system access
- `@modelcontextprotocol/server-postgres` — PostgreSQL
- `@modelcontextprotocol/server-brave-search` — Web search

---

## `enabledPlugins` — Plugin Activation

```json
"enabledPlugins": {
  "superpowers@claude-plugins-official": true
}
```

Enables the Superpowers plugin, which installs the `using-superpowers` bootstrap and all 14 methodology skills. Set to `false` to disable without uninstalling.

---

## `effort`

```json
"effort": "medium"
```

Controls Claude's default response depth:
- `"low"` — faster, cheaper, less thorough. Good for simple lookups.
- `"medium"` — balanced default. Works well for most development tasks.
- `"high"` — deeper reasoning, higher cost. Use for architecture decisions or complex bugs.

Can be overridden per-session via Claude Code's UI.
