# CLAUDE.md Guide

The `CLAUDE.md` is not a style guide. It's a behavioral contract — a set of rules Claude follows in every session, enforced through the system prompt. This guide walks through each section so you know what it does, what to keep, and what to customize.

---

## How CLAUDE.md Works

Claude Code loads `~/.claude/CLAUDE.md` at session start and injects it into Claude's context as a high-priority instruction set. Anthropic describes it as "instructions that Claude must follow." In practice:

- Rules in `CLAUDE.md` override Claude's defaults
- More specific rules override general ones
- Conflicting instructions from user messages still win over CLAUDE.md

---

## Section-by-Section Breakdown

### Local Model Routing

```markdown
## Local Model Routing (Token Optimization — Verified 2026-05-30)

**MANDATORY**: For the tasks below, ALWAYS call the local Ollama MCP tool FIRST.
```

**What it does**: Forces Claude to route structured extraction tasks to a local Ollama model instead of using its own reasoning. The table specifies exactly which tasks and which tools.

**Keep as-is** if you have Ollama set up. **Remove or comment out** if you don't have a local model — Claude will fall back gracefully but won't auto-route.

**Customize**: Add rows to the routing table for tasks specific to your workflow (e.g., "Parse SQL schema → ollama json").

---

### Core Directives

```markdown
## Core Directives
- Token Optimization: concise, dense responses. DRY code.
- Plan Mode: before massive changes, use Plan Mode.
- Documentation-First: read MEMORY.md and docs BEFORE exploring codebase.
- Simplicity Over Cleverness: choose simple unless there's an actual problem.
```

**What it does**: Sets the fundamental operating philosophy for all sessions.

**Keep as-is** — these are broadly useful for any serious development work.

**Consider removing** "Simplicity Over Cleverness" if you're building something where clever patterns genuinely help (e.g., performance-critical systems, DSL design).

---

### Phase-Driven Development

```markdown
## Phase-Driven Development (MANDATORY for multi-phase projects)
```

**What it does**: Requires Claude to create and maintain `docs/phases/PHASE-N-NAME.md` files for projects with multiple delivery milestones. Prevents Claude from starting Phase 2 before Phase 1 is verified.

**Keep for**: multi-person teams, long-running projects, anything with distinct delivery milestones.

**Remove for**: solo side projects, scripts, single-feature work. The overhead isn't worth it.

---

### Project Documentation Structure

```markdown
## Project Documentation Structure (Token Efficiency Guide)
```

**What it does**: Defines the MEMORY.md and docs/ structure that all projects must follow. This is the foundation of the documentation-first lookup strategy.

**Keep as-is** — the MEMORY.md discipline alone is worth it. The token savings from not re-reading files every session compound quickly.

**The key habit**: After completing any significant task, update the relevant project's MEMORY.md. This is what makes Claude consistent across sessions.

---

### Technology Stack Preferences

```markdown
## Technology Stack Preferences
### TypeScript / Node.js
### React
### Python
### FastAPI
...
```

**What it does**: Defines defaults for each language/framework — how to structure projects, which libraries to prefer, what patterns to follow.

**Customize heavily** — replace with your actual tech stack. If you don't use FastAPI, remove that section. If you use Next.js, add a Next.js section.

**Template for adding a new stack**:
```markdown
### [Framework/Language]
- [Key typing/structuring rule]
- [Preferred organization pattern]
- [Testing approach]
- [Linting/formatting tools]
```

---

### Code Quality & Git

```markdown
## Code Quality & Git
### Commits
- Use conventional commits: feat:, fix:, docs:, refactor:, test:, chore:.
### Linting
- TypeScript: ESLint + Prettier. Python: Ruff + Black.
```

**Keep as-is** — conventional commits and consistent linting are universally good practices.

**Customize**: Replace linting tools with whatever your project actually uses. Add `Bash(npx eslint *)` to your `settings.json` allow list.

---

### Information Lookup Strategy

```markdown
## Information Lookup Strategy (Token-Saving)

**Order of Lookup**:
1. MEMORY.md
2. docs/*.md
3. package.json / pyproject.toml
4. Type definitions
5. Only then: implementation files
```

**What it does**: Tells Claude to exhaust cheaper information sources before reading implementation files.

**Keep as-is** — this is pure upside. The only cost is the occasional case where the docs are stale and Claude trusts them over the current code. Mitigate by marking stale docs with `[STALE - verify against implementation]`.

---

### Memory & Learning Consolidation

```markdown
## Memory & Learning Consolidation
**CRITICAL PRACTICE**: After completing any significant task, always update MEMORY.md.
```

**What it does**: Defines when to update MEMORY.md (after features, bugs, gotchas, architecture decisions) and what to capture (current status, decisions, bug fixes, commands).

**Keep as-is** — this is the most important habit in the entire setup. Future-you (and future Claude) will thank present-you every session.

---

### Skills & Agents First Strategy

```markdown
## Skills & Agents First Strategy
**CRITICAL BEHAVIOR**: Before writing code or running manual commands, evaluate available skills and agents.
Priority Order: skills → agents → MCP servers → manual implementation
```

**What it does**: Enforces the skill and agent invocation hierarchy before any manual implementation.

**Keep as-is** — this is what separates "Claude as assistant" from "Claude as engineering system".

**Update the agent list** as you add or remove agents. The `144+ agents installed` reference becomes stale if you don't keep it current.

---

### Execution Rules

```markdown
## Execution Rules
- No TODO comments: Implement full solution.
- No exploratory runs: Use npm run dev ONLY when asked.
- Targeted edits: Always read file first.
- Question assumptions: Check MEMORY.md before changing patterns.
```

**Keep as-is** for production work. **Remove "no exploratory runs"** if you frequently use Claude for quick experiments.

---

### Verification & Trust

```markdown
## Verification & Trust
AI-generated code can look convincing even when wrong.
```

**What it does**: A set of reminders that Claude-generated code needs verification. Includes a checklist for when to run tests, review diffs, trace critical paths, and check assumptions.

**Keep as-is** — this is the most important safety section. The rules prevent the "it passed tests so it must be fine" failure mode.

---

## Customization Checklist

When adapting this `CLAUDE.md` for a new project or team:

- [ ] Update the tech stack preferences section for your actual stack
- [ ] Remove phase-driven development if it's a simple/solo project
- [ ] Add project-specific file locations and path conventions
- [ ] Update the agents list count if you've added/removed agents
- [ ] Add any team-specific conventions (PR template, branch naming, etc.)
- [ ] Remove the Ollama routing section if you don't have local models

---

## Project-Level CLAUDE.md

You can have a project-level `CLAUDE.md` in your project root (or `docs/` folder) that adds project-specific rules on top of the global one. Claude Code merges both.

Example `~/Projects/myapp/.claude/CLAUDE.md`:
```markdown
# MyApp Project Guidelines

## Architecture
- Backend: FastAPI with PostgreSQL
- Frontend: React + TypeScript + Tailwind
- Database schema at docs/architecture/schema.md

## Key Conventions
- All API routes return {data, error, metadata} shape
- Auth token validation in middleware, not controllers
- Feature flags via FEATURE_FLAGS env var

## Commands
- dev: pnpm dev (port 3000)
- test: pnpm test (Jest + coverage)
- db migrate: pnpm db:migrate
```

Project-level rules override global ones when they conflict, letting you specialize the behavior for each codebase.
