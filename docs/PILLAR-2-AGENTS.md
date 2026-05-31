# Pillar 2: Agent Dispatch System

Claude Code can spawn subagents — fresh Claude instances that handle a specific task independently, then return results. This setup uses 144 domain-specific agents from the [awesome-claude-code-subagents](https://github.com/daveshap/awesome-claude-code-subagents) catalog to ensure there's always a specialist available for any task.

---

## Why Specialist Agents Beat a Generalist

A generalist Claude asked to "optimize this PostgreSQL query" will produce a reasonable answer. A `postgres-pro` agent with a prompt focused entirely on PostgreSQL internals, index strategies, and query planning will produce a significantly better one.

The `CLAUDE.md` rule:

> Spawn a specialized agent when: task depth exceeds "quick fix" (usually >5 files, complex refactoring, architecture work), domain matches an agent name, or you're about to write >200 lines of complex code in a domain with a matching agent.

---

## Agent Categories

**Core Development** (20 agents)
`ai-engineer`, `architect-reviewer`, `backend-developer`, `build-engineer`, `cli-developer`, `codebase-orchestrator`, `code-reviewer`, `debugger`, `deployment-engineer`, `documentation-engineer`, `dx-optimizer`, `frontend-developer`, `fullstack-developer`, `legacy-modernizer`, `platform-engineer`, `refactoring-specialist`, `tooling-engineer`, `api-designer`, `api-documenter`, `agent-installer`

**Language Specialists** (25+ agents)
`angular-architect`, `blockchain-developer`, `cpp-pro`, `csharp-developer`, `django-developer`, `dotnet-core-expert`, `dotnet-framework-4.8-expert`, `elixir-expert`, `expo-react-native-expert`, `fastapi-developer`, `flutter-expert`, `golang-pro`, `javascript-pro`, `java-architect`, `kotlin-specialist`, `laravel-specialist`, `node-specialist`, `php-pro`, `python-pro`, `rails-expert`, `react-specialist`, `rust-engineer`, `spring-boot-engineer`, `swift-expert`, `symfony-specialist`, `typescript-pro`, `vue-expert`

**Infrastructure** (20+ agents)
`azure-infra-engineer`, `chaos-engineer`, `cloud-architect`, `database-administrator`, `database-optimizer`, `devops-engineer`, `devops-incident-responder`, `docker-expert`, `embedded-systems`, `iot-engineer`, `kubernetes-specialist`, `microservices-architect`, `network-engineer`, `postgres-pro`, `sre-engineer`, `terraform-engineer`, `terragrunt-expert`, `websocket-engineer`

**Quality & Security** (10 agents)
`accessibility-tester`, `ad-security-reviewer`, `compliance-auditor`, `incident-responder`, `penetration-tester`, `qa-expert`, `security-auditor`, `security-engineer`, `test-automator`, `ui-ux-tester`

**Data & AI** (15 agents)
`ai-engineer`, `data-analyst`, `data-engineer`, `data-researcher`, `data-scientist`, `dependency-manager`, `llm-architect`, `machine-learning-engineer`, `ml-engineer`, `mlops-engineer`, `nlp-engineer`, `quant-analyst`, `reinforcement-learning-engineer`, `sql-pro`

**Business & Product** (20 agents)
`business-analyst`, `competitive-analyst`, `content-marketer`, `customer-success-manager`, `fintech-engineer`, `game-developer`, `healthcare-admin`, `legal-advisor`, `license-engineer`, `market-researcher`, `mobile-app-developer`, `payment-integration`, `product-manager`, `project-idea-validator`, `project-manager`, `risk-manager`, `sales-engineer`, `scrum-master`, `ui-designer`, `wordpress-master`

**Research & Analysis** (10 agents)
`deep-research` (via skill), `general-purpose`, `knowledge-synthesizer`, `research-analyst`, `scientific-literature-researcher`, `search-specialist`, `technical-writer`, `trend-analyst`

---

## Installing the Agents Catalog

```bash
git clone https://github.com/daveshap/awesome-claude-code-subagents /tmp/awesome-subagents
mkdir -p ~/.claude/agents

# Copy all categories
cp /tmp/awesome-subagents/categories/01-core-development/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/02-language-specialists/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/03-infrastructure/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/04-quality-security/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/05-data-ai/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/06-developer-experience/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/07-specialized-domains/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/08-business-product/*.md ~/.claude/agents/
cp /tmp/awesome-subagents/categories/10-research-analysis/*.md ~/.claude/agents/

# Verify count
ls ~/.claude/agents/*.md | wc -l
```

Alternatively, use the `agent-installer` agent to discover and install agents interactively.

---

## How to Spawn Agents

Claude Code spawns agents via the `Agent` tool. You can trigger this explicitly:

```
# In a session, ask Claude to use a specialist:
"Use the postgres-pro agent to review this query for N+1 issues"
"Spawn a react-specialist to audit the component architecture"
"Use the security-engineer agent to threat-model this auth flow"
```

Or Claude will do it automatically when the `CLAUDE.md` rules apply (task depth >5 files, domain match, >200 lines in a specialist domain).

---

## Validating Agent Output

Agent findings are **starting points, not conclusions**. From `CLAUDE.md`:

- **Research findings**: Verify claims against primary sources (docs, actual code, official APIs)
- **Architecture recommendations**: Cross-check against your actual codebase
- **Code output**: Run tests, review diffs, spot-check logic for edge cases
- **Critical decisions**: Document assumptions and validation steps in MEMORY.md before acting

A later agent finding may invalidate an earlier one. Always synthesize before acting.

---

## Writing Your Own Agent

An agent is a Markdown file in `~/.claude/agents/`:

```markdown
---
name: my-specialist
description: Use this agent when [specific domain condition]. Invoke when [specific task type].
tools: Read, Write, Edit, Bash, Glob, Grep
---

You are a specialist in [domain]. Your expertise covers [specific areas].

When working on [task type], you always:
1. [Specific behavior 1]
2. [Specific behavior 2]
3. [Specific behavior 3]

[Domain-specific knowledge, constraints, or patterns]
```

The `description` field is the most important part — Claude uses it to decide when to spawn this agent automatically.
