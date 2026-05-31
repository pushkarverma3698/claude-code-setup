# Agents

This setup uses 144 domain-specific agents from the [awesome-claude-code-subagents](https://github.com/daveshap/awesome-claude-code-subagents) catalog. Each agent is a specialist — a Claude instance with a focused prompt, domain knowledge, and the right tools for its area.

## Why Agents?

A generalist Claude asked to "optimize this PostgreSQL query" is good. A `postgres-pro` agent with a prompt built entirely around query planning, index strategies, and execution plans is significantly better.

The rule from `CLAUDE.md`:

> Spawn a specialized agent when: task depth exceeds "quick fix" (usually >5 files, complex refactoring, architecture work), domain matches an agent name, or you're about to write >200 lines of complex code in a domain with a matching agent.

## Install the Full Catalog

```bash
git clone https://github.com/daveshap/awesome-claude-code-subagents /tmp/awesome-subagents
mkdir -p ~/.claude/agents

# Install all categories
cp /tmp/awesome-subagents/categories/01-core-development/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/02-language-specialists/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/03-infrastructure/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/04-quality-security/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/05-data-ai/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/06-developer-experience/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/07-specialized-domains/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/08-business-product/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/10-research-analysis/*.md ~/.claude/agents/

# Verify installation
ls ~/.claude/agents/*.md | wc -l
# Should show ~144
```

## Quick Reference: Most-Used Agents

| Task | Agent to spawn |
|------|---------------|
| React performance, hooks, state management | `react-specialist` |
| Go concurrency, idiomatic patterns | `golang-pro` |
| Rust ownership, lifetimes, async | `rust-engineer` |
| Python type hints, FastAPI, pytest | `python-pro` |
| TypeScript generics, type-level programming | `typescript-pro` |
| PostgreSQL queries, indexes, replication | `postgres-pro` |
| Docker, CI/CD, deployment | `devops-engineer` |
| Kubernetes workloads | `kubernetes-specialist` |
| Security audit, threat modeling | `security-engineer` |
| Production incidents | `devops-incident-responder` |
| Complex bugs, root cause analysis | `debugger` |
| Code quality review | `code-reviewer` |
| API design and docs | `api-designer` |
| System architecture | `architect-reviewer` |
| Data pipelines, ETL | `data-engineer` |
| ML model serving | `ml-engineer` |
| Next.js, App Router | `nextjs-developer` |
| Comprehensive research | `research-analyst` |

## How Claude Spawns Agents

When you describe a task, Claude checks the available agents against the `CLAUDE.md` rules. You can also trigger it explicitly:

```
# Ask Claude directly:
"Use the postgres-pro agent to review this query for performance issues"
"Spawn a security-engineer to audit the authentication flow"
"Use react-specialist to optimize these components"
```

## Validating Agent Output

Agent output is a **starting point, not a conclusion**. From `CLAUDE.md`:

- Verify claims against primary sources (docs, actual code, official APIs)
- Cross-check architecture recommendations against your actual codebase
- Run tests and review diffs — don't auto-trust agent output
- Document critical decisions in `MEMORY.md` before acting on them

## Writing Your Own Agent

Add a `.md` file to `~/.claude/agents/`:

```markdown
---
name: my-specialist
description: Use when working on [specific domain or task type]. Invoke for [concrete trigger conditions].
tools: Read, Write, Edit, Bash, Glob, Grep
---

You are a specialist in [domain]. You have deep expertise in [specific areas].

When working on [task type], you:
1. Always [behavior 1]
2. Never [behavior 2]
3. Check [specific thing] before [action]

[Domain-specific knowledge, common pitfalls, preferred patterns]
```

The `description` field is what Claude uses to decide when to spawn your agent. Make it specific and concrete — vague descriptions lead to the agent never being chosen or being chosen for the wrong tasks.
