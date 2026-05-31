# Quick Start — 5-Minute Setup

Get the full setup running in 5 minutes (core files) or ~30 minutes (with Ollama local routing).

## Prerequisites

- [Claude Code](https://claude.ai/code) installed and authenticated
- macOS or Linux (Windows: adapt paths accordingly)
- (Optional) [Ollama](https://ollama.ai) for local model routing

---

## Step 1: Copy CLAUDE.md

```bash
# Back up your existing CLAUDE.md if you have one
[ -f ~/.claude/CLAUDE.md ] && cp ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.backup

# Copy the global guidelines
cp CLAUDE.md ~/.claude/CLAUDE.md
```

If you already have a `CLAUDE.md` with custom content, review and merge manually rather than overwriting.

---

## Step 2: Copy the Output Truncation Hook

```bash
mkdir -p ~/.claude/hooks
cp hooks/filter-output.sh ~/.claude/hooks/filter-output.sh
chmod +x ~/.claude/hooks/filter-output.sh
```

---

## Step 3: Configure settings.json

Review `settings.json` and either:

**Option A** — Copy directly (if you don't have an existing config):
```bash
cp settings.json ~/.claude/settings.json
# Update the hook path
sed -i '' "s|/YOUR/HOME|$HOME|g" ~/.claude/settings.json
```

**Option B** — Merge manually (if you have existing settings):
1. Open `settings.json` and `~/.claude/settings.json` side by side
2. Merge the `env` block (token optimization vars)
3. Merge the `permissions.allow` and `permissions.deny` arrays
4. Add the `hooks.PostToolUse` entry (update the path)
5. Add the `enabledPlugins` entry

---

## Step 4: Install Superpowers Plugin

Open Claude Code and run:
```
/plugin install superpowers@claude-plugins-official
```

This installs 14 development methodology skills that auto-trigger at the right moments. No manual invocation needed — the plugin wires everything up automatically.

---

## Step 5: Install Community Skills (Optional)

See [skills/README.md](../skills/README.md) for the full list. Install the ones that match your workflow:

```
/skills install deep-research
/skills install systematic-debugging
/skills install frontend-design
```

---

## Step 6: Install Agents Catalog (Optional, ~5 min)

144 domain-specific agents from the awesome-claude-code-subagents catalog:

```bash
git clone https://github.com/daveshap/awesome-claude-code-subagents /tmp/awesome-subagents
mkdir -p ~/.claude/agents
cp /tmp/awesome-subagents/categories/**/*.md ~/.claude/agents/
```

See [agents/README.md](../agents/README.md) for details.

---

## Step 7: Set Up Ollama Local Routing (Optional, ~20 min)

This is the highest-leverage optional step — routes structured extraction tasks to a free local model instead of burning Claude API tokens.

See [docs/MCP-SETUP.md](MCP-SETUP.md) for the full setup guide.

---

## Verification

After setup, verify everything is working:

**1. Hook is working:**
```bash
# Run a command that produces verbose output and confirm it gets truncated
# In a Claude Code session, ask Claude to run: npm list --depth=5
# Output should show "... (N lines truncated) ..." if >200 lines
```

**2. CLAUDE.md loaded:**
```
# In Claude Code, ask:
What does your CLAUDE.md say about local model routing?
```
Claude should respond with the Ollama routing table.

**3. Superpowers skill fires:**
```
# In Claude Code, say:
Let's add a login feature to my app
```
Claude should invoke `brainstorming` before writing any code — asking clarifying questions rather than jumping straight to implementation.

**4. Settings verified:**
```bash
# Check no sensitive data crept in
grep -n "YOUR_COMPOSIO_API_KEY\|/YOUR/HOME" ~/.claude/settings.json
# Should return nothing (or show the placeholder comments, which is fine)
```

---

## Common Issues

**Hook not firing**: Verify the path in `settings.json` matches the actual file location:
```bash
ls -la ~/.claude/hooks/filter-output.sh
# Should show the file with execute permission (-rwxr-xr-x)
```

**CLAUDE.md not loaded**: Claude Code loads `~/.claude/CLAUDE.md` automatically at session start. Start a new session after copying.

**Superpowers not triggering**: The plugin requires a fresh session after installation. Close and reopen Claude Code.

**settings.json syntax error**: The file uses JSONC (JSON with comments). If Claude Code rejects it, remove the `//` comments or validate with a JSONC linter.
