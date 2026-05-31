# MCP Setup Guide

Model Context Protocol (MCP) servers extend Claude with external tools and data sources. This guide covers setting up the two most impactful MCP servers in this configuration: Ollama (local model routing) and Composio (external service integrations).

---

## Ollama — Local Model Routing

Ollama runs LLMs locally on your machine. This setup routes structured extraction tasks to Ollama instead of Claude API, saving tokens and API costs.

### 1. Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Verify
ollama --version
```

### 2. Pull Models

Two models cover the use cases in this setup:

```bash
# For JSON/structured output tasks (parsing, extraction)
ollama pull llama3.2:3b        # Fast, good for structured tasks
# or
ollama pull qwen2.5:7b         # Better quality, slightly slower

# For code tasks (commit messages, code analysis)
ollama pull codellama:7b       # Code-specialized model
# or
ollama pull qwen2.5-coder:7b   # Best code quality locally
```

### 3. Start Ollama Server

```bash
ollama serve
# Runs at http://localhost:11434
# Verify: curl http://localhost:11434/api/tags
```

On macOS, Ollama runs automatically after installation. On Linux, add it to your startup services:
```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

### 4. Install the Ollama MCP Server

```bash
# Clone and set up the MCP server
git clone https://github.com/CakeCrusher/ollama-mcp-server ~/Projects/ollama-mcp-server
cd ~/Projects/ollama-mcp-server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 5. Configure in settings.json

Update the path in your `~/.claude/settings.json`:

```json
"mcpServers": {
  "ollama": {
    "command": "/Users/YOUR_USERNAME/Projects/ollama-mcp-server/venv/bin/python3",
    "args": ["/Users/YOUR_USERNAME/Projects/ollama-mcp-server/server.py"],
    "env": {
      "OLLAMA_URL": "http://localhost:11434"
    }
  }
}
```

### 6. Verify

In a Claude Code session:
```
What tools do you have from the ollama MCP server?
```
Claude should list `generate`, `embed`, `classify`, and `health`.

Then test the routing:
```
Use the ollama MCP to parse this into JSON: "name: Alice, age: 30, role: engineer"
```

---

## Composio — External Service Integrations (Optional)

Composio provides a single MCP server that connects to 250+ external services (Gmail, LinkedIn, Google Drive, GitHub, Slack, etc.) through a unified API.

### 1. Get a Composio API Key

Sign up at [composio.dev](https://composio.dev) and get your API key from the dashboard.

### 2. Download the MCP Entity Script

This repo's `settings.json` references a `composio-mcp-entity.mjs` file. Get it from Composio's official MCP setup:

```bash
# Follow Composio's setup guide at:
# https://docs.composio.dev/mcp/claude-code
# This will provide the composio-mcp-entity.mjs file and setup instructions
```

### 3. Configure in settings.json

```json
"mcpServers": {
  "composio": {
    "command": "node",
    "args": ["/path/to/composio-mcp-entity.mjs"],
    "env": {
      "COMPOSIO_API_KEY": "YOUR_COMPOSIO_API_KEY",
      "COMPOSIO_ENTITY_ID": "default",
      "COMPOSIO_APPS": "GMAIL,GOOGLEDRIVE,GITHUB"
    }
  }
}
```

**Multiple entities**: If you want separate identities for personal and work accounts, create multiple server entries with different `COMPOSIO_ENTITY_ID` values.

### 4. Connect Your Accounts

```bash
# In Claude Code, trigger account connection:
# Ask Claude to "connect my Gmail account via Composio"
# This opens a browser for OAuth flow
```

---

## Other Recommended MCP Servers

### GitHub

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
  }
}
```

Get a token at: https://github.com/settings/tokens (needs `repo`, `read:org` scopes)

### PostgreSQL

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```

### Filesystem (for cross-project access)

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/YOUR_USERNAME/Projects"]
}
```

---

## Building Custom MCP Servers

Use the `mcp-builder` skill (from the community skills list) to build custom MCP servers with Claude's help:

```
/skills use mcp-builder
```

Or reference the [official MCP documentation](https://modelcontextprotocol.io) directly. The `CLAUDE.md` MCP pattern:

> FastMCP: Atomic, single-purpose tools. Thorough parameter descriptions. Example: `tools/web_search.ts` + `tools/web_search.test.ts`.

Each tool should do one thing, with clear parameter descriptions that help Claude use it correctly.
