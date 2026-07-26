# Claude Code Global Guidelines

## Local Model Routing (Token Optimization — MANDATORY)

**⚠️ CRITICAL**: For the tasks below, ALWAYS call the local Ollama MCP tool FIRST. This saves 1000s of tokens per session. Do NOT skip local model checks to use Claude reasoning — the local model output is deterministic, production-verified, and **free (zero token cost)**.

**Configured models:**
- `model_type="json"` → qwen2.5:7b (structured data extraction)
- `model_type="code"` → qwen2.5-coder:7b (code generation, commit messages)
- `model_type="fast"` → qwen2.5:7b (general-purpose)
- `embed` → nomic-embed-text (semantic similarity)

**ENFORCEMENT (OPERATIONAL RULE)**: Before EVERY Claude response involving the tasks below, check if the task matches one of these categories. If it does, **call the Ollama MCP tool FIRST — this is NOT optional**. Do not rationalize or skip this step. If you encounter a prompt matching any of these task types, you MUST invoke Ollama before using Claude reasoning. The founder's token budget depends on this.

| Task | Tool Call | Examples | Token Savings |
|------|-----------|----------|----------------|
| Extract/parse JSON from unstructured text | `mcp__ollama__generate(model_type="code", prompt="Extract X from Y...")` | Config files, diffs, requirements, API responses, error logs | ~500-1000 tokens saved |
| Parse Python/Node dependencies | `mcp__ollama__generate(model_type="code", prompt="Parse dependencies from...")` | requirements.txt, package.json, pyproject.toml, Gemfile (100% accuracy verified) | ~300-500 tokens saved |
| Generate commit messages from diffs | `mcp__ollama__generate(model_type="code", prompt="Generate conventional commit from: git diff...")` | Before EVERY git commit — required workflow | ~200-400 tokens saved per commit |
| Semantic similarity / deduplication | `mcp__ollama__embed(text=...)` then cosine similarity | Check if two tasks/strings are equivalent, detect duplicates | ~100-300 tokens saved |

**NEVER use local models for**: Bug scanning, architecture review, cross-file reasoning, design decisions, anything requiring nuanced judgment. Escalate those to Claude immediately.

**Error handling**: If local tool returns an error, fall back to Claude reasoning silently — do not ask the user.

**Session-wide impact**: Proper local model usage = 5-10% reduction in Claude token consumption per session.

---

## Cost Control — Zero Paid API Calls During Development (NON-NEGOTIABLE)

Every live API call to Gemini or OpenRouter costs real money. Development iterations must be **zero-cost**. This is a hard rule, not a preference.

### The Three Zones

| Zone | What runs | Allowed cost |
|------|-----------|-------------|
| **Dev loop** (write → test → fix) | `pnpm test` (mocked LLM) + Ollama local models | **$0** |
| **Integration check** (pre-PR) | Free-tier model via OpenRouter | **$0** |
| **Live verification** (PR-ready only) | Real Gemini / MTProto QA | Minimal, once per PR |

### Enforcement Rules

1. **`pnpm test` must be $0.** If any unit or integration test makes a real LLM API call, it is a bug. Tests use mocks. No exceptions.
2. **Never run probe scripts iteratively.** `scripts/probe-*.ts` and `scripts/e2e-telegram-qa.ts` cost Gemini tokens. If something isn't working, write a failing unit test first, fix it, then run the probe ONCE to verify.
3. **Use free OpenRouter models for any integration run during development.** Set `AGENT_MODEL=openrouter:google/gemini-2.5-flash-preview-05-20:free` (or `openrouter:deepseek/deepseek-r1:free` as fallback). Never set `AGENT_MODEL=google-genai:gemini-2.5-flash` during dev iterations.
4. **`pnpm eval` is a milestone gate, not a debugging tool.** Run it once when the feature is complete. Not once per attempt.
5. **MTProto / live Telegram QA** happens exactly once: when all unit tests are green, lint is clean, and you're about to push the PR. Not before.
6. **If a bug requires a live call to reproduce**, write a unit test that captures the failure first. The live call is only to confirm the fix — after the test is green.
7. **Ollama is always free.** Use it aggressively for anything in the local model routing table above.

### Free Tier Model Reference

```
# Development / integration testing (free)
AGENT_MODEL=openrouter:google/gemini-2.5-flash-preview-05-20:free
AGENT_FALLBACK_MODELS=openrouter:deepseek/deepseek-r1:free,openrouter:meta-llama/llama-3.3-70b-instruct:free

# Production (paid, only on VPS)
AGENT_MODEL=openrouter:google/gemini-2.5-flash-preview-05-20
```

Free tier limits (OpenRouter): 50 RPD per model. Enough for milestone verification, not for iterative testing.

---

## Core Directives
*   **Truth Over Agreement** (⚠️ NON-NEGOTIABLE): Never optimize for making the user feel good. Do not agree, praise, or validate a claim/plan/code just because it was proposed by the user. If something is wrong, risky, inefficient, or based on a false premise, say so directly and explain why — even if it contradicts what the user wants to hear. Do not soften technical assessments with unnecessary hedging or flattery. Push back when warranted; correctness and honesty outrank agreeableness.
*   **Local Models FIRST** (⚠️ NON-NEGOTIABLE): For JSON extraction, dependency parsing, commit messages, and semantic similarity — ALWAYS call Ollama MCP before Claude. This is not optional. See [Local Model Routing](#local-model-routing-token-optimization--mandatory) section.
*   **Token Optimization**: Use concise, dense responses. Do not explain basic concepts unless asked. Write modular, DRY code. Assume prior work context via MEMORY.md and project docs.
*   **Plan Mode**: Before massive multi-file changes or architectural refactors, use Plan Mode. Wait for approval.
*   **Documentation-First**: Consult MEMORY.md and project docs BEFORE exploring codebase. Reduces token waste on rediscovery.
*   **Simplicity Over Cleverness**: Before adopting a pattern, library, or abstraction, ask: Does this solve an *actual* problem (not hypothetical)? Is the simpler solution sufficient? If uncertain, choose simple.
*   **Specialist Agents for Reliability** (⚠️ NON-NEGOTIABLE): For any domain-specific work (code review, architecture, testing, debugging, refactoring, security analysis), ALWAYS delegate to the respective specialized agent. Do NOT attempt inline reasoning for these tasks. Reliability comes from specialization, not generalist attempts. Examples: `code-reviewer` for code quality, `architect` for system design, `tdd-guide` for test-driven development, `security-reviewer` for security vulnerabilities, `build-error-resolver` for compilation failures. Inline reasoning on these topics produces worse results and higher error rates.

---

## LLM Coding Discipline (Karpathy Guidelines)

See also the `karpathy-guidelines` skill.

*   **Think Before Coding**: State assumptions explicitly before implementing. If multiple interpretations exist, present them — don't silently pick one. If a simpler approach exists, say so and push back when warranted. If something is unclear, stop and name what's confusing rather than guessing.
*   **Surgical Changes Discipline**: When editing existing code, don't "improve" adjacent code, comments, or formatting, and don't refactor things that aren't broken — match existing style even if you'd do it differently. If you notice unrelated dead code, mention it, don't delete it. Only remove imports/variables/functions that your own change made unused. Every changed line should trace directly to the user's request.
*   **Goal-Driven Execution**: Convert vague tasks into verifiable success criteria (e.g., "fix the bug" → "write a test that reproduces it, then make it pass"). For multi-step tasks, state a brief plan with a verify step per item so progress can be checked without constant clarification.

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

## Local Tools (Ollama + Safari MCP)

- **Ollama**: `qwen2.5:7b` (code/json/fast), `nomic-embed-text` (embeddings) at `http://localhost:11434`. See Local Model Routing above.
- **Safari MCP**: ALWAYS prefer for browser automation (form filling, navigation, scraping). 40-60% less CPU than Chromium on Apple Silicon. Requires macOS Screen Recording + Automation permissions (granted once).

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


