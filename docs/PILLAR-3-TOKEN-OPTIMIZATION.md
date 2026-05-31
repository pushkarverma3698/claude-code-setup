# Pillar 3: Token Budget Discipline

Claude API tokens are finite and expensive. A session with no discipline can burn through context on verbose tool outputs, repeated file reads, and tasks that don't actually need Claude's reasoning. This pillar covers the five mechanisms in this setup that extend effective context windows and reduce costs.

---

## Why Token Discipline Matters

Claude Code's context window fills from both directions:
- **Input tokens**: everything Claude reads (your messages, tool outputs, system prompt, files)
- **Output tokens**: everything Claude writes (responses, code, plans)

When the context gets full, Claude either stops working or compacts — losing nuance in the process. The goal is to keep the most relevant information in context as long as possible.

---

## Mechanism 1: Local Model Routing via Ollama

The highest-leverage optimization. Certain tasks are deterministic and don't need Claude's reasoning — they just need a model that can follow a structured format. Route these locally.

**Routing table** (enforced via `CLAUDE.md`):

| Task | Tool | When to use |
|------|------|-------------|
| Extract structured data / JSON | `mcp__ollama__generate(model_type="json")` | Parsing config files, diffs, requirements, unstructured text |
| Parse dependencies | `mcp__ollama__generate(model_type="json")` | `requirements.txt`, `pyproject.toml` — 100% accurate |
| Generate commit message | `mcp__ollama__generate(model_type="code")` | Before every commit — conventional format |
| Semantic similarity / dedup | `mcp__ollama__embed(text=...)` → cosine sim | Checking if two strings describe the same concept |

**Why this works**: These tasks are structurally simple. A local 7B or 13B model running at localhost:11434 handles them just as well as Claude — for free, in milliseconds, without consuming any context window.

**What NOT to route locally**: bug scanning, architecture review, cross-file reasoning, anything requiring nuanced judgment. Those stay with Claude.

**Fallback**: If the local model returns an error, Claude silently falls back to its own reasoning. No user interruption.

### Setup

See [docs/MCP-SETUP.md](MCP-SETUP.md) for Ollama installation and MCP server configuration.

---

## Mechanism 2: AUTOCOMPACT at 50%

```json
"CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
```

Claude Code auto-compacts context when it gets full. By default this happens around 80% capacity. Setting it to 50% means Claude compacts earlier — while there's still plenty of room.

**Why 50% and not 80%?** When compaction happens at 80%, you're already in a cramped context. Tool outputs, inline diffs, and error messages get truncated or dropped. Starting compaction earlier preserves more nuance in the summary and keeps subsequent tool calls working with full fidelity.

**Tradeoff**: You compact more frequently, but each compaction is higher-quality because there's less pressure. For long sessions working on large codebases, this is almost always the right trade.

---

## Mechanism 3: Output Truncation Hook

File: [`hooks/filter-output.sh`](../hooks/filter-output.sh)

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "~/.claude/hooks/filter-output.sh" }]
    }
  ]
}
```

After every Bash command, this hook runs before the output hits Claude's context. It:
1. Strips ANSI escape codes (color codes from CLIs add tokens without information)
2. If output is >200 lines: keeps first 50 + last 50, inserts a truncation notice
3. If output is ≤200 lines: passes through unchanged

**Impact**: `npm install` output: typically 300-500 lines → 100 lines. `docker logs`: 1000+ lines → 100 lines. `pytest` full output: 400 lines → 100 lines (first failures + final summary).

**Tuning the thresholds**: Edit `filter-output.sh` — change `200` (trigger threshold), `50` (head lines), and `50` (tail lines) to match your preference.

```bash
# Default: trigger at 200 lines, keep 50+50
if [ "$lines" -gt 200 ]; then
  head -50 ... tail -50

# Aggressive: trigger at 100 lines, keep 30+30
# if [ "$lines" -gt 100 ]; then
#   head -30 ... tail -30
```

---

## Mechanism 4: Documentation-First Lookup Order

Enforced in `CLAUDE.md` as a mandatory lookup sequence before reading any implementation file:

```
1. MEMORY.md       — fast, comprehensive, session-persistent
2. docs/*.md       — architecture, patterns, design decisions
3. package.json / pyproject.toml — dependencies, scripts, versions
4. Type definitions (types.ts, *.pyi) — data shapes
5. Only then: implementation files
```

**Why this matters**: Every time Claude reads a file, that file's contents consume context tokens. Reading a 500-line `auth.ts` to answer "what auth library do we use?" wastes context that a one-line `MEMORY.md` entry could answer for free.

**The MEMORY.md pattern**: After completing any significant task, update `MEMORY.md` with:
- What was completed
- Any gotchas discovered (version quirks, API changes, race conditions)
- Architecture decisions and why
- Commands to run

This investment pays dividends across sessions — Claude never rediscovers the same information twice.

---

## Mechanism 5: Telemetry and Thinking Caps

```json
"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"  // No background pings
"MAX_THINKING_TOKENS": "10000"                     // Cap extended thinking
```

**Telemetry**: Disabling nonessential traffic removes background network requests that add latency and occasionally add to token counts.

**Thinking tokens**: Claude's extended thinking mode (used for complex reasoning) can consume thousands of tokens per response. Capping at 10,000 prevents runaway thinking on simple tasks while still allowing deep reasoning when needed. Remove this cap for genuinely complex architecture or debugging sessions.

---

## Combined Effect

Running all five mechanisms together on a typical 2-hour development session:

| Mechanism | Estimated token savings |
|-----------|------------------------|
| Local model routing (5-10 structured tasks) | 2,000–5,000 input tokens |
| AUTOCOMPACT timing | Qualitative — preserves more context fidelity |
| Output truncation (10-20 bash commands) | 5,000–15,000 input tokens |
| Documentation-first lookup (avoid re-reading files) | 2,000–10,000 input tokens |
| Telemetry off | Minimal, mostly latency benefit |

The output truncation hook and local model routing together typically save 10,000–20,000 input tokens per session. At Claude's pricing, that's meaningful — and the savings compound across hundreds of sessions.
