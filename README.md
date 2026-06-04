<div align="center">

# Claude Code — Power User Setup

**Skills-first development · 144-agent dispatch · Token budget discipline**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Power%20User-blueviolet)](https://claude.ai/code)
[![Skills](https://img.shields.io/badge/Skills-29%20installed-green)](skills/README.md)
[![Agents](https://img.shields.io/badge/Agents-144%20available-blue)](agents/README.md)
[![Tokens Saved](https://img.shields.io/badge/Tokens%20saved-~1%2C800%2Fsession-orange)](docs/PILLAR-3-TOKEN-OPTIMIZATION.md)

</div>

---

Most Claude Code setups look like this: a blank `CLAUDE.md` that says "be helpful", no memory strategy, no skill system, watching Claude reinvent the wheel every session while burning through tokens.

This is not that.

---

## At a Glance

| What | Numbers |
|------|---------|
| Global config file (`CLAUDE.md`) | 215 lines — audited down from 388 |
| Token savings vs. naïve config | ~1,800 tokens every cold-start session |
| Skills installed | 29 (14 Superpowers + 15 community) |
| Domain agents available | 144 |
| Token optimization mechanisms | 5 working in parallel |
| Local model routing tasks | 4 task types run free via Ollama |
| Context autocompact threshold | 50% (vs. default ~80%) |

---

## The Three Pillars

### Pillar 1 — Skills-First Development

Before Claude writes a single line of code, it checks a library of 29 skills. Planning a feature? It invokes `brainstorming` + `writing-plans`. Debugging a race condition? `systematic-debugging`. Shipping a PR? `requesting-code-review` → `verification-before-completion`.

The difference between *Claude as autocomplete* and *Claude as senior engineer* is that the second follows a methodology every time — not just when you remember to ask. The `CLAUDE.md` **mandates** skill invocation before any implementation action.

**14 Superpowers skills** (official plugin, auto-triggers at the right moment):

| Skill | When It Fires |
|-------|--------------|
| `brainstorming` | Before any feature work |
| `writing-plans` | After brainstorming, before coding |
| `test-driven-development` | Before writing implementation |
| `systematic-debugging` | When diagnosing failures |
| `verification-before-completion` | Before marking anything done |
| `requesting-code-review` | Before submitting a PR |
| `dispatching-parallel-agents` | When work can be parallelized |
| `finishing-a-development-branch` | Before merging a branch |
| + 6 more | — |

**15 community skills** on top — see [skills/README.md](skills/README.md).

> Full deep-dive: [docs/PILLAR-1-SKILLS.md](docs/PILLAR-1-SKILLS.md)

---

### Pillar 2 — 144-Agent Dispatch System

Domain-specific agents from the [awesome-claude-code-subagents](https://github.com/anthropics/claude-code/discussions) catalog. When a task needs depth, Claude spawns the right specialist instead of guessing with a generalist.

The `postgres-pro` agent has a prompt built entirely around query planning, index strategies, and execution plans. It is materially better than a generalist Claude at that task.

**The rule**: before writing >200 lines in a domain with a matching agent, spawn that agent.

**Most-used:**

```
react-specialist   golang-pro        rust-engineer      python-pro
typescript-pro     postgres-pro      devops-engineer    kubernetes-specialist
security-engineer  debugger          code-reviewer      architect-reviewer
nextjs-developer   data-engineer     ml-engineer        research-analyst
```

> Full catalog + install: [agents/README.md](agents/README.md)

---

### Pillar 3 — Token Budget Discipline

Five mechanisms working in parallel to extend effective context and cut API costs:

| Mechanism | Impact | Config Location |
|-----------|--------|----------------|
| **Local model routing** | 4 task types → free Ollama, 0 Claude tokens | `CLAUDE.md` routing table |
| **AUTOCOMPACT at 50%** | Compacts at 50% capacity vs. ~80% default | `settings.json` env |
| **Output truncation hook** | Bash outputs >200 lines → 50+50 | `hooks/filter-output.sh` |
| **Documentation-first lookup** | 5-step info order before reading code | `CLAUDE.md` |
| **Disabled telemetry** | No background token pings | `settings.json` env |

**Local model routing table** — these tasks run free via Ollama instead of Claude:

```
Task                                     → Tool
─────────────────────────────────────────────────────────────────
Extract structured data / JSON from text → mcp__ollama__generate(json)
Parse requirements.txt / pyproject.toml  → mcp__ollama__generate(json)
Generate commit message from git diff    → mcp__ollama__generate(code)
Semantic similarity / deduplication      → mcp__ollama__embed → cosine sim
```

> Full breakdown: [docs/PILLAR-3-TOKEN-OPTIMIZATION.md](docs/PILLAR-3-TOKEN-OPTIMIZATION.md)

---

## Before and After

```
BEFORE                                    AFTER
──────────────────────────────────────    ──────────────────────────────────────
"Write a React auth component"            Claude invokes brainstorming,
→ Claude writes code immediately          asks 3 clarifying questions,
                                          invokes writing-plans, then codes.

"Debug this error"                        Claude invokes systematic-debugging,
→ Claude reads the stack and guesses      follows 4-phase fault isolation,
                                          identifies root cause systematically.

Context fills with 500 lines of           filter-output.sh truncates to 50+50.
npm install output.                       Ollama handles JSON parsing locally.

Claude re-reads the same architecture     MEMORY.md + 5-step lookup order.
docs every single session.                Claude knows where things are.

CLAUDE.md: 388 lines, ~4,200 tokens       CLAUDE.md: 215 lines, ~2,400 tokens
loaded on every cold start.               ~1,800 tokens saved every session.
```

---

## What's in This Repo

| File | Purpose |
|------|---------|
| [`CLAUDE.md`](CLAUDE.md) | Global behavioral contract — the most impactful file |
| [`settings.json`](settings.json) | Annotated config: token vars, permissions, hooks, MCP servers |
| [`hooks/filter-output.sh`](hooks/filter-output.sh) | PostToolUse hook: truncates verbose Bash output |
| [`skills/README.md`](skills/README.md) | 15 community skills with install commands |
| [`agents/README.md`](agents/README.md) | 144 agents catalog + install instructions |
| [`docs/QUICK-START.md`](docs/QUICK-START.md) | 5-minute setup with exact commands |
| [`docs/PILLAR-1-SKILLS.md`](docs/PILLAR-1-SKILLS.md) | Skills system deep dive |
| [`docs/PILLAR-2-AGENTS.md`](docs/PILLAR-2-AGENTS.md) | Agent dispatch system guide |
| [`docs/PILLAR-3-TOKEN-OPTIMIZATION.md`](docs/PILLAR-3-TOKEN-OPTIMIZATION.md) | All 5 token mechanisms explained |
| [`docs/CLAUDE-MD-GUIDE.md`](docs/CLAUDE-MD-GUIDE.md) | Section-by-section walkthrough of `CLAUDE.md` |
| [`docs/SETTINGS-GUIDE.md`](docs/SETTINGS-GUIDE.md) | Every `settings.json` field explained |
| [`docs/MCP-SETUP.md`](docs/MCP-SETUP.md) | Ollama local model setup guide |

---

## Quick Install

> Full guide: [docs/QUICK-START.md](docs/QUICK-START.md)

```bash
# 1. Back up and replace CLAUDE.md
[ -f ~/.claude/CLAUDE.md ] && cp ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.backup
cp CLAUDE.md ~/.claude/CLAUDE.md

# 2. Install the output truncation hook
mkdir -p ~/.claude/hooks
cp hooks/filter-output.sh ~/.claude/hooks/filter-output.sh
chmod +x ~/.claude/hooks/filter-output.sh

# 3. Merge settings.json into ~/.claude/settings.json
# Review and merge manually, or copy directly if starting fresh:
cp settings.json ~/.claude/settings.json
sed -i '' "s|/YOUR/HOME|$HOME|g" ~/.claude/settings.json

# 4. Install Superpowers plugin (inside Claude Code)
# /plugin install superpowers@claude-plugins-official

# 5. (Optional) Install community skills — see skills/README.md
# (Optional) Install 144-agent catalog — see agents/README.md
# (Optional) Set up Ollama local routing — see docs/MCP-SETUP.md
```

---

## What Makes the CLAUDE.md Different

It's not a style guide — it's a **behavioral contract**. Key sections:

- **Local Model Routing** — mandatory routing table: Ollama handles deterministic tasks, Claude handles judgment
- **Skills & Agents First** — priority order before writing any code: skills → agents → MCP → implement manually
- **Information Lookup Order** — 5-step order before reading code files (MEMORY.md → docs → config → types → implementation)
- **Phase-Driven Development** — one phase doc per milestone, never start phase N+1 before N is verified
- **Verification & Trust** — AI-generated code looks convincing even when wrong; every significant change gets traced

> See [docs/CLAUDE-MD-GUIDE.md](docs/CLAUDE-MD-GUIDE.md) for a section-by-section walkthrough.

---

## Customization

**Keep for any project**: core directives, verification discipline, information lookup order, skills & agents strategy.

**Customize for your stack**: tech preferences (TypeScript/React/Python sections), linting tools, directory conventions.

**Remove for simpler setups**: Ollama routing (no local GPU), phase-driven development (solo projects).

**Add**: project-specific context, team conventions, additional MCP server configs, your own skills.

---

## Contributing

PRs welcome for:
- Hook improvements (better truncation, new PostToolUse patterns)
- Skill recommendations and install instructions
- Settings improvements and annotations
- Documentation fixes

Not accepting: personal `MEMORY.md` files, project-specific configs, or `CLAUDE.md` sections that only apply to one domain.

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).

---

## License

MIT — copy freely, adapt to your setup.
