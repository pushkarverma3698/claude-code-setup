# Contributing

Thanks for your interest in improving this setup.

## What's Welcome

- **Hook improvements** — better truncation thresholds, new PostToolUse patterns, Stop hook examples
- **Skill recommendations** — new community skills worth including, updated install commands
- **Settings improvements** — new permission patterns, useful env vars, MCP server configurations
- **Documentation fixes** — typos, outdated steps, unclear instructions
- **New docs** — guides for workflows not currently covered (Windows setup, team sharing patterns, etc.)

## What's Not Accepted

- Personal `MEMORY.md` files or project-specific configs
- `CLAUDE.md` sections that only apply to one domain or stack
- Changes to the CLAUDE.md that restructure its philosophy without evidence of improvement
- New agents (the agents catalog lives in [awesome-claude-code-subagents](https://github.com/daveshap/awesome-claude-code-subagents) — contribute there)

## How to Contribute

1. Fork the repo
2. Create a branch: `git checkout -b fix/hook-threshold`
3. Make your change
4. Test it (see Testing section below)
5. Submit a PR with a clear description of what changed and why

## Testing Your Changes

**For hook changes**: Run a command that produces >200 lines of output and verify the truncation behavior matches your intent.

**For settings changes**: Copy the modified `settings.json` to `~/.claude/settings.json`, start a new Claude Code session, and verify the behavior.

**For CLAUDE.md changes**: Run at least 2-3 different task types and verify Claude follows the new rules consistently.

**For documentation changes**: Follow the instructions yourself from scratch (or have someone unfamiliar with the setup try them).

## PR Description Template

```
## What changed
[1-2 sentences]

## Why
[What problem this solves or improves]

## Testing done
[How you verified the change works]
```
