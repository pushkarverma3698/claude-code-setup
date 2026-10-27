# claude-code-setup — retired snapshot

**Status:** Superseded by ~/.agents/AGENTS.md (2026-10-27)

This repo is a public showcase snapshot of a July 2026 Claude Code setup. It is not the live config and nothing reads this file: `~/.claude/CLAUDE.md` imports `~/.agents/AGENTS.md`, and no tool symlinks or imports this repo.

The previous contents of this file were removed because they no longer match the machine:
- Ollama qwen2.5 routing: local Ollama has only `nomic-embed-text`.
- OpenRouter free-model IDs and "no paid fallback" cost zones: stale.
- "Always delegate review to a specialist agent": review is not delegable (FounderOS rule #29).

Do not copy the old version into `~/.claude/CLAUDE.md`. Recover it with `git show 87e6d63:CLAUDE.md`.
