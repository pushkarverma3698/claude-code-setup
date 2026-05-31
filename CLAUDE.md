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

Any project with more than one distinct delivery milestone **must** use phase-driven development. This is non-negotiable — it keeps both Claude and the human aligned across sessions.

### Rules

1. **One phase doc per phase** — created before the phase starts, updated as it progresses, finalized when complete.
2. **Phase docs live in `docs/phases/`** — `PHASE-1-<NAME>.md`, `PHASE-2-<NAME>.md`, etc.
3. **Read the phase docs at session start** — same discipline as MEMORY.md. Never touch phase work without knowing current phase status.
4. **Never start Phase N+1 before Phase N is verified** — "verified" means: all deliverables checked off, success criteria confirmed, and the verification results written into the phase doc.
5. **Phase doc structure** (every phase doc must have):
   - Goal (1-sentence)
   - Deliverables checklist (checkboxes, updated in real-time)
   - Architecture decisions made during this phase
   - Success criteria (measurable)
   - Open questions (resolved before the phase closes)
   - Verification results (filled in when phase completes)

### Docs Folder Convention

Every project's `docs/` folder must be organized by role:

```
docs/
├── phases/          # Phase tracking docs — PHASE-1-NAME.md, PHASE-2-NAME.md
├── architecture/    # System design, data flows, API contracts, DB schema
├── study/           # Research, competitive analysis, market data, user research
└── (other role dirs as the project grows)
```

- **Never leave docs flat** — always file into the correct subfolder.
- **`study/` is read-only reference** — never updated from code changes, only from new research.
- **`architecture/` updates when design changes** — if you change an architectural decision, update the doc in the same commit.

### Claude's instruction
At the start of any session on a multi-phase project:
1. Read `docs/phases/PHASE-<current>.md` — understand what's in progress
2. Check which deliverables are checked off vs pending
3. Never start Phase N+1 tasks inside a Phase N session without explicit user confirmation

---

## Project Documentation Structure (Token Efficiency Guide)

Every project MUST have:

### 1. **MEMORY.md** (Project-level, `.claude/memory/`)
Persists across sessions. Contains:
- Current status (what works, what's in progress, what's pending)
- Critical gotchas (breaking API changes, version-specific quirks)
- Key file locations (src paths, config locations, entry points)
- Architecture decisions and WHY (trade-offs, constraints)
- Recent bug fixes and their root causes
- Commands to run (setup, dev, build, test)

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

---

## Code Quality & Git

### Commits
*   Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
*   Keep commits atomic. One concern per commit.
*   Bad: `git commit -m "update everything"`
*   Good: `git commit -m "feat: add user authentication flow"`

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

**CRITICAL PRACTICE**: After completing any significant task, always update the relevant project's MEMORY.md. This is how Claude learns project context and avoids rediscovery in future sessions — it directly reduces token waste across projects.

### When to Update MEMORY.md

Update after:
- **Completing a feature** — add to "Current status" section, note any design decisions
- **Fixing a bug** — document the root cause, symptoms, and solution in "Recent bug fixes"
- **Discovering a gotcha** — add to "Critical gotchas" section immediately (version conflicts, API quirks, breaking changes)
- **Making an architecture decision** — document the trade-off analysis in "Architecture decisions and WHY"
- **Learning a new pattern** — add to docs/PATTERNS.md or note in MEMORY.md if it's project-specific
- **Updating dependencies or configs** — note breaking changes, new scripts, or env var additions
- **Installing a skill or agent** — document which ones are active in this project and when to use them

### What to Capture

**Current Status** (at session start, update at end):
- What feature/task was just completed
- What's in progress (next steps)
- What's blocked or pending
- Critical PRs/branches to know about

**Architecture Decisions**:
- Decision title and date
- Options considered and why others were rejected
- Trade-offs and constraints
- Where in code this lives

**Recent Bug Fixes**:
- Symptom (what the user saw)
- Root cause (what the code was doing wrong)
- Fix applied (minimal change needed)
- Test added (regression prevention)

**Critical Gotchas**:
- Breaking API changes between versions
- Race conditions or timing issues
- Environment-specific quirks (local dev vs staging)
- Performance traps

**Commands**:
- `npm run dev` — what port, what does it do
- `npm test` — test runner, coverage flags
- `npm build` — output location, build time expectations
- Setup commands with prerequisites

### Format & Consistency

Keep MEMORY.md **dense and scannable**:
- Bullet points over prose
- Link to relevant code files or docs (e.g., `src/features/auth/providers.ts`)
- Use timestamps for recent entries: `[2026-05-26] Fixed race condition in...`
- Cross-reference between sections (e.g., "See Gotcha: async state updates")

**Key principle**: If Claude (future you, next session) would waste tokens rediscovering this information, it belongs in MEMORY.md.

### Auto-Memory Review

After updates, optionally run `/memory` to review what Claude auto-captured from the session. Use the `consolidate-memory` skill to merge duplicates and prune stale entries every few sessions.

---

## Skills & Agents First Strategy

**CRITICAL BEHAVIOR**: Before writing code or running manual commands for a task, evaluate available skills and agents. This is how the system learns and automates recurring work.

### Priority Order (DO THIS BEFORE IMPLEMENTING)

1. **Check available skills** (`/skills` or skill listing in system prompt)
   - Skills are single-purpose automation tools (email tasks, code generation, dependency audit, etc.)
   - Use skills WHENEVER they match the task intent, even partially
   - Example: "summarize my emails" → use email skill, not manual mail parsing

2. **Check available agents** (144+ agents installed)
   - Agents are specialized Claude deployments for narrow domains (React architect, Python pro, DevOps engineer, etc.)
   - If task requires deep expertise in a domain, spawn the relevant agent
   - Example: "help me design a React component architecture" → spawn react-specialist agent

3. **Check available MCP servers** (personal-rag, github, composio, turicks-brain, etc.)
   - MCP tools (search functions, GitHub operations, Gmail/Calendar access) are always faster than manual implementation
   - Always search knowledge bases (personal-rag, turicks-brain) before reading raw files
   - Example: "what's our auth architecture" → search_turicks_decisions first, then search_turicks_chats

4. **Implement manually ONLY if**:
   - No skill exists for this task
   - No agent specializes in this domain
   - No MCP server covers this functionality
   - Task requires custom logic not in any available tool

### When to Spawn Agents

Spawn a specialized agent when:
- Task depth exceeds "quick fix" (usually >5 files, complex refactoring, architecture work)
- Domain matches an agent name: `react-specialist`, `rust-engineer`, `devops-engineer`, `ml-engineer`, etc.
- User asks "help me" + domain (implies need for expert depth)
- You're about to write >200 lines of complex code in a domain with a matching agent

### Validating Agent Output

**Agent findings are starting points, not conclusions.** Always validate before trusting:
- **Research findings**: Verify claims against primary sources (docs, actual code, official APIs)
- **Architecture recommendations**: Cross-check against your actual codebase and MEMORY.md decisions
- **Code output**: Run tests, review diffs, spot-check logic for edge cases
- **Multi-agent synthesis**: Use turicks-brain to synthesize conflicting findings; don't accept first result
- **Critical decisions**: Document assumptions and validation steps in MEMORY.md before acting

**Avoid fragmented conclusions**: When an agent surfaces multiple findings, validate the *dependencies* between them. A later finding may invalidate an earlier one.

### Examples

**Bad**: User asks "analyze my project dependencies for security" → manually read package.json and compare to CVE databases

**Good**: User asks same → spawn `dependency-manager` agent; it has CVE audit built-in

**Bad**: "Summarize my recent emails" → write email parsing code

**Good**: "Summarize my recent emails" → use composio Gmail skill or spawn agent with email tools

**Bad**: "What's our decision on using MCP?" → search raw docs with grep

**Good**: "What's our decision on using MCP?" → search_turicks_decisions (synthesized wiki)

---

## Script & Workflow Preservation

When a Python script, shell script, Node.js script, or automation workflow is written and verified working:
1. **Save it** with a descriptive kebab-case name (e.g., `dedupe-zshrc-paths.py`, `batch-rename-images.sh`)
2. **Location**: `~/Projects/scripts/` — ALL reusable scripts go here (Python, Node, shell). Project-specific scripts also live in that project's `scripts/` directory.
3. **Add a docstring/header comment** explaining what it does, when to use it, and any dependencies.
4. **Make executable**: `chmod +x` for shell scripts.
5. **Never leave working scripts in `/tmp`, scratchpad, or inline-only** — always persist to disk.

---

## Prompt & Playbook Preservation

When a workflow playbook, prompt template, or reusable AI prompt is created:
1. **Save it** to `~/Projects/prompts/` with a descriptive kebab-case filename (e.g., `turicks-marketing-video.md`, `linkedin-post-generator.md`)
2. **Format**: Markdown. Include overview, prerequisites, step-by-step workflow, gotchas, and a reuse checklist.
3. **Naming**: `{project-or-topic}.md` — no generic names like `prompt.md`.
4. **Never leave playbooks buried inside a project repo only** — always mirror to `~/Projects/prompts/` so they're findable across sessions.
5. **Index**: If `~/Projects/prompts/README.md` exists, add an entry. If not, create it when the third prompt is added.

---

## File & Directory Conventions

*   **All projects live under `~/Projects/`** — no spaces in directory names, use kebab-case.
*   **Every new codebase is initialised in `~/Projects/`** — when spinning up any new project, always `mkdir ~/Projects/{name}` first. Never initialise in `~`, `~/Desktop`, or any other location.
*   **Directory structure**:
    - `~/Projects/{project-name}/` — active projects
    - `~/Projects/scripts/` — ALL reusable standalone scripts (Python, Node, shell, configs)
    - `~/Projects/prompts/` — workflow playbooks, prompt templates, reusable AI prompts
    - `~/Projects/sandbox/` — experiments, tutorials, throwaway projects
    - `~/Projects/archive/` — deprecated projects and old artifacts
*   **No loose files in `~`** — scripts, configs, and project dirs belong under `~/Projects/`.
*   **Current active project paths**:
    - `~/Projects/linkedin-automation-tool` — Turicks LinkedIn AI agent (was `~/turicks`)

---

## Execution Rules

*   **No TODO comments**: Implement full solution unless user explicitly scopes it down.
*   **No exploratory runs**: Use `npm run dev` / `python main.py` ONLY when asked or to verify compilation. Not for exploration.
*   **Targeted edits**: Always read file first, understand context, apply surgical edits. Never rewrite entire files unless necessary.
*   **Question assumptions**: If a pattern seems odd, check MEMORY.md for the "why" before changing it.

---

## Verification & Trust

**AI-generated code can look convincing even when wrong.** Always verify before trusting:

### Verification Checklist
- **Run tests** after any code modification. Failing tests don't guarantee correctness, but passing tests catch obvious errors.
- **Review diffs** before committing. Spot-check logic, variable names, and edge cases. Don't auto-trust diff summaries.
- **Trace critical paths** manually for 1–2 scenarios (happy path + one error case).
- **Check assumptions** in function signatures, data types, and API contracts. Verify against actual implementations, not documentation alone.
- **Log-and-check**: For async/concurrent code, add logging and observe actual runtime behavior. Race conditions hide in code review.

### When Verification is Critical
- Before deploying to production (non-negotiable)
- After any agent modifies core logic (auth, payments, RAG pipeline)
- After complex refactoring (>10 files changed)
- Before merging to main branch
- After accepting agent architecture recommendations (verify against MEMORY.md decisions)

### Trust Boundaries
- **Don't trust summaries**: Always read source material for architecture decisions, API specs, or design docs.
- **Don't trust agent claims about code behavior**: Run tests and trace logic yourself.
- **Don't auto-merge PRs from agents**: Use `superpowers:verification-before-completion` skill to validate.
- **Don't assume agent preserved behavior during refactoring**: Even with tests passing, check that the refactored logic still matches the original intent.

