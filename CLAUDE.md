# Claude Code Global Guidelines

## Local Model Routing (Token Optimization — Verified 2026-05-30)

**MANDATORY**: For the tasks below, ALWAYS call the local Ollama MCP tool FIRST. Do not use Claude reasoning for these — the local model output is deterministic and production-verified.

| Task | Tool | When to use |
|------|------|-------------|
| Extract structured data / JSON from text | `mcp__ollama__generate(model_type="json", ...)` | Any time you need to parse config files, diffs, requirements, or unstructured text into JSON |
| Parse dependencies from requirements.txt / pyproject.toml | `mcp__ollama__generate(model_type="json", ...)` | Always — 100% accurate on both formats |
| Generate a commit message from a git diff | `mcp__ollama__generate(model_type="code", ...)` | Before every commit — use conventional format prompt |
| Semantic similarity check / deduplication | `mcp__ollama__embed(text=...)` → cosine similarity | When checking if two strings/tasks are the same concept |

**Do NOT use local models for**: bug scanning, architecture review, cross-file reasoning, anything requiring nuanced judgment. Escalate those to Claude immediately.

**If local tool returns an error**: fall back to Claude reasoning silently — do not ask the user.

---

## Core Directives
*   **Token Optimization**: Use concise, dense responses. Do not explain basic concepts unless asked. Write modular, DRY code. Assume prior work context via MEMORY.md and project docs.
*   **Plan Mode**: Before massive multi-file changes or architectural refactors, use Plan Mode. Wait for approval.
*   **Documentation-First**: Consult MEMORY.md and project docs BEFORE exploring codebase. Reduces token waste on rediscovery.
*   **Simplicity Over Cleverness**: Before adopting a pattern, library, or abstraction, ask: Does this solve an *actual* problem (not hypothetical)? Is the simpler solution sufficient? If uncertain, choose simple.

---

## Phase-Driven Development (MANDATORY for multi-phase projects)

Any project with more than one distinct delivery milestone **must** use phase-driven development.

1. One phase doc per phase in `docs/phases/` — `PHASE-1-<NAME>.md`, etc.
2. Read the current phase doc at session start. Never skip.
3. Never start Phase N+1 before Phase N is verified (deliverables checked, success criteria confirmed, results written in).
4. Phase doc must have: Goal, Deliverables checklist, Architecture decisions, Success criteria, Open questions, Verification results.

Docs folder convention: `docs/phases/`, `docs/architecture/`, `docs/study/` — never leave docs flat.

---

## Project Documentation Structure (Token Efficiency Guide)

Every project MUST have:

### 1. **MEMORY.md** (Project-level, `.claude/memory/`)
Persists across sessions: current status, critical gotchas, key file locations, architecture decisions + WHY, recent bug fixes, commands to run.

**Claude's instruction**: Read MEMORY.md first EVERY session before touching code. No exceptions.

### 2. **docs/** (Codebase-level)
Organize by ROLE, not by file:
- `docs/LOCAL_DEV.md` — setup, troubleshooting, env vars
- `docs/ARCHITECTURE.md` — system design, data flows, module boundaries
- `docs/API.md` — endpoint specs, request/response shapes
- `docs/PATTERNS.md` — recurring patterns (how we handle errors, logging, state)
- `docs/{FEATURE}.md` — deep dives for complex features (RAG pipeline, auth flow)

**Claude's instruction**: Use docs to answer design questions. If doc is stale, mark it. Don't re-read codebase for answers already in docs.

### 3. **CLAUDE.md** (This file)
Global defaults + tech stack + coding style. Not project-specific.

---

## Technology Stack Preferences

### Local Models (Ollama)
Models: `qwen2.5:7b` (reasoning/code/json), `nomic-embed-text` (embeddings). Configured via MCP at `http://localhost:11434`. See [Local Model Routing](#local-model-routing-token-optimization--verified-2026-05-30) table above for mandatory usage rules. Ensure Ollama is running (`ollama serve`).

### TypeScript / Node.js
*   Use strict typing. Prefer ES modules (`import/export`). Avoid `any`. Use interfaces over types where possible.
*   Organize by feature, not layer: `src/features/{feature}/` contains logic, UI, types, tests.

### React
*   Functional components only. Use hooks. Prefer Tailwind CSS. Keep components small and composable.
*   Document component APIs in JSDoc (props, examples). Props interfaces in same file or adjacent `types.ts`.

### Python
*   Use type hints (`def func(a: int) -> str:`). Follow PEP 8. Use `pytest` for testing.
*   Structure: `src/{feature}/` contains logic; `tests/test_{feature}.py` mirrors structure.

### FastAPI
*   Use async for I/O endpoints. Pydantic models for validation. Document endpoints with docstrings (auto-generates OpenAPI).

### AI/RAG (LangChain & LangGraph)
*   Prioritize state management (LangGraph Annotation with reducers).
*   For RAG: semantic chunking + hybrid search (keyword + semantic).
*   Prompts: centralized in `prompts/` directory, versioned, templated with jinja2 or f-strings.
*   Agent flows: define in code, not YAML. Document state transitions in MEMORY.md.

### Vector DBs
*   Batch embeddings correctly. Use hybrid search. Document schema changes in MEMORY.md.

### FastMCP
*   Atomic, single-purpose tools. Thorough parameter descriptions. Example: `tools/web_search.ts` + `tools/web_search.test.ts`.

### Browser Automation (Safari MCP)
*   **ALWAYS use Safari MCP for**: native browser automation, form filling, JavaScript-heavy sites, navigation workflows, document uploads, multi-step interactions.
*   **Installed**: Safari MCP v2.11.9+ via `npx safari-mcp` (configured in `~/.claude/settings.json`).
*   **Advantages**: 40-60% less CPU on Apple Silicon vs Chromium, native WebKit, AppleScript integration, persistent sessions.
*   **Key tools**: 80+ tools including `navigate`, `click`, `type`, `fill_form`, `get_text`, `take_screenshot`, `wait_for_element`, `extract_table`, etc.
*   **Common workflows**: job applications, web scraping, data entry automation, UI testing.
*   **Permissions required** (macOS): Screen Recording, Automation (granted once, persistent).
*   **Limitations**: CAPTCHA-protected sites, aggressive rate-limiting, sites that detect/block automation.
*   **Best practices**: Add delays between actions, respect robots.txt, test on staging first, document target URL patterns in MEMORY.md.

---

## Code Quality & Git

### Commits
*   Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
*   Keep commits atomic. One concern per commit.

### Linting
*   TypeScript: ESLint + Prettier (assume configured).
*   Python: Ruff + Black (assume configured).
*   Fix linter errors before submitting. Non-negotiable.

---

## Information Lookup Strategy (Token-Saving)

**Order of Lookup** (DO THIS BEFORE READING CODE):
1. **MEMORY.md** — fast, comprehensive, up-to-date
2. **docs/*.md** — architecture, patterns, design decisions
3. **package.json** / `pyproject.toml` / config files — dependencies, scripts, versions
4. **Type definitions** (`types.ts`, `*.pyi`) — data shapes
5. **Only then**: implementation files

**DO NOT**:
- Read entire files to understand structure when docs exist
- Ask "where is X" when MEMORY.md has file locations
- Re-read the same file twice in a session (cache in context)

---

## Memory & Learning Consolidation

Update MEMORY.md after completing features, fixing bugs, discovering gotchas, or making architecture decisions. Keep it **dense and scannable** — bullet points, timestamps (`[2026-05-26] Fixed...`), links to source files. If Claude (next session) would waste tokens rediscovering it, it belongs in MEMORY.md.

Use the `consolidate-memory` skill to merge duplicates and prune stale entries every few sessions.

---

## Skills & Agents First Strategy

**Before writing code or running manual commands**, evaluate available skills and agents:

1. **Check available skills** — use whenever they match the task intent, even partially
2. **Check available agents** (144+ installed) — spawn for domain-specific depth (React, Python, DevOps, ML, etc.)
3. **Check available MCP servers** — MCP tools are always faster than manual implementation
4. **Implement manually ONLY if** no skill, agent, or MCP covers the task

**When to spawn agents**: task depth exceeds >5 files, domain matches an agent name, or you're about to write >200 lines in a specialized domain.

**Validate agent output**: Run tests, review diffs, trace critical paths. Agent findings are starting points, not conclusions.

**Example**: "Analyze project dependencies for security" → spawn `dependency-manager` agent, not manual package.json grep.

---

## Script & Workflow Preservation

When a script or automation workflow is written and verified working:
1. Save to `~/Projects/scripts/` — kebab-case name, docstring header, `chmod +x` for shell scripts
2. Project-specific scripts also live in that project's `scripts/` directory
3. Never leave working scripts in `/tmp`, scratchpad, or inline-only

---

## Prompt & Playbook Preservation

When a workflow playbook or reusable AI prompt is created:
1. Save to `~/Projects/prompts/` — kebab-case `.md` file with overview, prerequisites, steps, gotchas
2. Always mirror here — never leave playbooks buried in a single project repo only
3. Add entry to `~/Projects/prompts/README.md` when third prompt is added

---

## File & Directory Conventions

*   All projects: `~/Projects/{project-name}/` — kebab-case, no spaces. Never initialise in `~`, `~/Desktop`, or elsewhere.
*   `~/Projects/scripts/` — ALL reusable standalone scripts (Python, Node, shell, configs)
*   `~/Projects/prompts/` — workflow playbooks, prompt templates, reusable AI prompts
*   `~/Projects/sandbox/` — experiments, tutorials, throwaway projects
*   `~/Projects/archive/` — deprecated projects and old artifacts
*   No loose files in `~`

---

## Execution Rules

*   **No TODO comments**: Implement full solution unless user explicitly scopes it down.
*   **No exploratory runs**: Use `npm run dev` / `python main.py` ONLY when asked or to verify compilation. Not for exploration.
*   **Targeted edits**: Always read file first, understand context, apply surgical edits. Never rewrite entire files unless necessary.
*   **Question assumptions**: If a pattern seems odd, check MEMORY.md for the "why" before changing it.

---

## Verification & Trust

Use `superpowers:verification-before-completion` before any significant merge or deploy. Don't trust agent summaries — trace logic yourself. Don't auto-merge agent PRs.

**Critical moments**: before production deploy, after any agent modifies core logic, after >10-file refactors, before merging to main.
