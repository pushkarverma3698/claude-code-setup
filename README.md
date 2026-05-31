# claude-code-setup

**A production-hardened Claude Code configuration built on three compounding principles: Skills, Agents, and Token Discipline.**

Most Claude Code setups look like this: a blank `CLAUDE.md` that says "be helpful", no memory strategy, no skill system, watching Claude reinvent the wheel every session while burning through tokens.

This is not that.

---

## The Three Pillars

### 1. Skills-First Development

Before Claude writes a single line of code, it checks a library of 30+ skills. Planning a feature? It invokes `brainstorming` + `writing-plans`. Debugging a race condition? `systematic-debugging`. Shipping a PR? `requesting-code-review` then `verification-before-completion`.

The difference between "Claude as autocomplete" and "Claude as senior engineer" is that the second one follows a methodology every time — not just when you remember to ask for it. The `CLAUDE.md` in this repo **mandates** skill invocation before any implementation action.

**14 Superpowers skills** (official plugin, auto-triggers):

| Skill | Category | When It Fires |
|-------|----------|--------------|
| `brainstorming` | Design | Before any feature work or new component |
| `writing-plans` | Planning | After brainstorming, before coding |
| `test-driven-development` | Testing | Before writing implementation code |
| `systematic-debugging` | Debugging | When diagnosing bugs or failures |
| `verification-before-completion` | Quality | Before marking any task done |
| `requesting-code-review` | Review | Before submitting a PR |
| `receiving-code-review` | Review | When responding to review feedback |
| `dispatching-parallel-agents` | Coordination | When work can be parallelized |
| `executing-plans` | Execution | When running a multi-step plan |
| `subagent-driven-development` | Execution | Fast iteration with two-stage review |
| `using-git-worktrees` | Isolation | Before feature work needing isolation |
| `finishing-a-development-branch` | Shipping | Before merging a branch |
| `writing-skills` | Meta | When creating new skills |
| `using-superpowers` | Meta | Bootstrap at session start |

**15 community skills** installed on top — see [skills/README.md](skills/README.md).

---

### 2. Agent Dispatch System

144 domain-specific agents available on-demand via the [awesome-claude-code-subagents](https://github.com/daveshap/awesome-claude-code-subagents) catalog. When a task needs depth, Claude spawns the right specialist rather than guessing with a generalist.

Categories: core development, language specialists (Go, Rust, Python, TypeScript, C++, Swift, Kotlin, Elixir...), infrastructure, quality/security, data/AI, business/product, research/analysis.

**The rule in `CLAUDE.md`**: before writing >200 lines in a domain with a matching agent, spawn that agent. The `react-specialist` knows React better than a generalist Claude ever will.

See [agents/README.md](agents/README.md) for install instructions.

---

### 3. Token Budget Discipline

Five mechanisms working together to extend effective context windows and reduce API costs:

| Mechanism | What It Does | Where |
|-----------|-------------|-------|
| **Local model routing** | Structured extraction (JSON, deps, commits, similarity) → Ollama locally | `CLAUDE.md` + `settings.json` |
| **AUTOCOMPACT at 50%** | Compacts context at 50% capacity instead of ~80% | `settings.json` env |
| **Output truncation hook** | Truncates Bash outputs >200 lines to 50+50 | `hooks/filter-output.sh` |
| **Documentation-first lookup** | 5-step info order before reading code | `CLAUDE.md` |
| **Disabled telemetry** | No background pings | `settings.json` env |

**Local model routing table** (from `CLAUDE.md`):

```
Task                                    → Tool
────────────────────────────────────────────────────────────────
Extract structured data / JSON          → mcp__ollama__generate (json)
Parse requirements.txt / pyproject.toml → mcp__ollama__generate (json)
Generate commit message from git diff   → mcp__ollama__generate (code)
Semantic similarity / deduplication     → mcp__ollama__embed → cosine sim
```

These tasks are deterministic and don't need Claude's reasoning. Running them locally is free, instant, and just as accurate.

---

## What Changes After Setup

**Before**: `"Write me a React auth component"` → Claude writes code immediately.  
**After**: Claude invokes `brainstorming`, asks 3 clarifying questions, invokes `writing-plans`, then codes.

**Before**: `"Debug this error"` → Claude reads the stack trace and guesses.  
**After**: Claude invokes `systematic-debugging`, follows a structured 4-phase fault isolation process.

**Before**: Context window fills with 500 lines of `npm install` output.  
**After**: `filter-output.sh` truncates it to 50+50 lines. Ollama handles the JSON parsing locally.

**Before**: Claude re-reads the same architecture docs every session.  
**After**: `MEMORY.md` + 5-step lookup order means Claude knows where things are without reading files twice.

---

## What's in This Repo

| File | Purpose |
|------|---------|
| [`CLAUDE.md`](CLAUDE.md) | 18KB global directives — the single most impactful file |
| [`settings.json`](settings.json) | Annotated config with token optimization, permissions, hooks |
| [`hooks/filter-output.sh`](hooks/filter-output.sh) | PostToolUse hook: truncates verbose Bash output |
| [`skills/README.md`](skills/README.md) | 15 community skills with install commands |
| [`agents/README.md`](agents/README.md) | 144 agents catalog — install instructions |
| [`docs/QUICK-START.md`](docs/QUICK-START.md) | 5-minute setup with exact commands |
| [`docs/PILLAR-1-SKILLS.md`](docs/PILLAR-1-SKILLS.md) | Skills system deep dive |
| [`docs/PILLAR-2-AGENTS.md`](docs/PILLAR-2-AGENTS.md) | Agent dispatch system guide |
| [`docs/PILLAR-3-TOKEN-OPTIMIZATION.md`](docs/PILLAR-3-TOKEN-OPTIMIZATION.md) | All 5 token mechanisms explained |
| [`docs/CLAUDE-MD-GUIDE.md`](docs/CLAUDE-MD-GUIDE.md) | How to read and customize `CLAUDE.md` |
| [`docs/SETTINGS-GUIDE.md`](docs/SETTINGS-GUIDE.md) | Every `settings.json` field explained |
| [`docs/MCP-SETUP.md`](docs/MCP-SETUP.md) | Ollama local model setup guide |

---

## Quick Install

> Full guide: [docs/QUICK-START.md](docs/QUICK-START.md)

```bash
# 1. Copy CLAUDE.md to your global Claude Code config
cp CLAUDE.md ~/.claude/CLAUDE.md

# 2. Merge settings.json (update paths to YOUR_HOME first)
# Review and manually merge settings.json into ~/.claude/settings.json
# Or copy it directly if you don't have an existing config:
cp settings.json ~/.claude/settings.json

# 3. Install the output truncation hook
mkdir -p ~/.claude/hooks
cp hooks/filter-output.sh ~/.claude/hooks/filter-output.sh
chmod +x ~/.claude/hooks/filter-output.sh

# 4. Update the hook path in settings.json
sed -i '' 's|/YOUR/HOME|'"$HOME"'|g' ~/.claude/settings.json

# 5. Install Superpowers plugin (in Claude Code)
# /plugin install superpowers@claude-plugins-official

# 6. (Optional) Install agents catalog
# See agents/README.md

# 7. (Optional) Set up Ollama for local model routing
# See docs/MCP-SETUP.md
```

---

## The CLAUDE.md: What Makes It Different

The `CLAUDE.md` is the most important file here. It's not a style guide — it's a behavioral contract. Key sections:

- **Local Model Routing** — mandatory routing table for token-heavy deterministic tasks
- **Phase-Driven Development** — for multi-phase projects: one phase doc, never start phase N+1 before N is verified
- **Skills & Agents First Strategy** — priority order: skills → agents → MCP servers → manual implementation
- **Information Lookup Strategy** — 5-step order before reading code (`MEMORY.md` → docs → config → types → implementation)
- **Memory & Learning Consolidation** — when and what to write to `MEMORY.md` after each session
- **Verification & Trust** — AI-generated code can look convincing even when wrong. Every significant change gets traced.

See [docs/CLAUDE-MD-GUIDE.md](docs/CLAUDE-MD-GUIDE.md) for a full section-by-section walkthrough.

---

## Customization

**Keep for any project**: core directives, verification framework, information lookup strategy, skills & agents strategy.

**Customize for your stack**: tech stack preferences (TypeScript/React/Python sections), linting tools, directory conventions.

**Remove for simpler setups**: phase-driven development section (solo projects), Ollama routing (if no local GPU).

**Add**: project-specific context, your team's conventions, additional MCP server configs.

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
