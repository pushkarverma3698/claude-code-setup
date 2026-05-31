# Pillar 1: Skills-First Development

Skills are pre-written workflows that Claude invokes before taking action. Instead of jumping straight to code, Claude triggers a skill that guides it through the right methodology for the task. This turns Claude from a fast code generator into a disciplined engineer who designs before building, tests before shipping, and reviews before merging.

---

## How Skills Work in Claude Code

A skill is a Markdown file with a frontmatter `name` and `description`. When a skill is invoked (either automatically or manually), its content is loaded into Claude's context and followed as an instruction set.

The `CLAUDE.md` in this repo mandates skill invocation at the start of every applicable task:

```
If you think there is even a 1% chance a skill might apply to what you are doing,
you ABSOLUTELY MUST invoke the skill.
```

This is enforced through the `using-superpowers` bootstrap that the Superpowers plugin installs — it loads at session start and wires the trigger logic.

---

## The Superpowers Plugin: 14 Skills

The official Superpowers plugin (`superpowers@claude-plugins-official`) provides the core development methodology. These skills auto-trigger at the right moments — you don't need to invoke them manually.

**Install**:
```
/plugin install superpowers@claude-plugins-official
```

| Skill | Category | Auto-triggers when... |
|-------|----------|-----------------------|
| `brainstorming` | Design | You describe any new feature or component |
| `writing-plans` | Planning | After brainstorming is complete |
| `test-driven-development` | Testing | Before writing implementation code |
| `systematic-debugging` | Debugging | A bug or failure needs investigation |
| `verification-before-completion` | Quality | Before marking a task as done |
| `requesting-code-review` | Review | Before submitting a PR |
| `receiving-code-review` | Review | Responding to review feedback |
| `dispatching-parallel-agents` | Coordination | Work has independent parallel tracks |
| `executing-plans` | Execution | Running a multi-step approved plan |
| `subagent-driven-development` | Execution | Fast iterative implementation with two-stage review |
| `using-git-worktrees` | Isolation | Feature work that needs an isolated workspace |
| `finishing-a-development-branch` | Shipping | Before merging a completed branch |
| `writing-skills` | Meta | Creating a new custom skill |
| `using-superpowers` | Meta | Bootstrap — runs at session start |

### What the brainstorming → writing-plans → executing flow looks like

1. You say: "Let's add user authentication"
2. `brainstorming` triggers: Claude asks clarifying questions one at a time (OAuth or JWT? which providers? session management strategy?)
3. After alignment: `writing-plans` triggers: Claude writes a detailed implementation plan with exact file paths, function signatures, test cases
4. You approve the plan
5. `executing-plans` triggers: Claude works through each step, invoking `test-driven-development` per task
6. Before the PR: `requesting-code-review` triggers a pre-submission checklist
7. On merge: `finishing-a-development-branch` handles cleanup

The entire flow is guided. No single step requires you to remember to ask for it.

---

## 15 Community Skills

These extend the Superpowers methodology with domain-specific workflows.

| Skill | Purpose | Best for |
|-------|---------|---------|
| `brand-guidelines` | Enforce brand voice, colors, and rules in all outputs | Marketers, content teams |
| `deep-research` | Multi-agent research synthesis across many sources | Competitive analysis, technical research |
| `fact-checker` | Verify claims against authoritative sources with confidence scores | Content validation |
| `find-skill` | Natural language skill discovery gateway | Finding the right skill for any task |
| `find-skills` | Browse and install new skills | Extending the skill library |
| `frontend-design` | Production-grade UI with a proper design system | Building dashboards and interfaces without "AI slop" |
| `humanizer` | Remove documented AI writing patterns from text | Content that needs to feel genuinely human |
| `mcp-builder` | Build MCP servers (Python FastMCP or Node SDK) | Integrating external APIs with Claude |
| `office-hours` | Y Combinator partner-style forcing questions | Pressure-testing business ideas |
| `seo-skill` | Full technical SEO audit with competitor comparison | Website optimization |
| `skill-creator` | Interview-driven custom skill builder | Building new skills for your workflow |
| `systematic-debugging` | Structured 4-phase root cause analysis | Complex bugs and production incidents |
| `token-optimization` | Process large documents with minimal tokens | Avoiding context limits on large source material |
| `ui-ux-pro-max` | Production-grade UI/UX design and optimization | Serious interface work |
| `webapp-testing` | Comprehensive web application testing workflows | QA and end-to-end testing |

### Installing Community Skills

Skills are installed in `~/.claude/skills/`. Installation method depends on the skill source:

```bash
# Via Claude Code skill command (if available in marketplace)
/skills install deep-research
/skills install systematic-debugging

# Or manually: copy the SKILL.md to ~/.claude/skills/{skill-name}/SKILL.md
```

---

## Skills vs Agents: When to Use Which

| Situation | Use | Reason |
|-----------|-----|--------|
| Need a structured workflow (design, debug, review) | Skill | Skills guide methodology, not implementation |
| Need deep domain expertise (React internals, Rust lifetime issues) | Agent | Agents are specialists with domain knowledge |
| Task is >5 files or complex refactoring | Agent | Spawn a specialist to protect main context |
| Task is methodology/process related | Skill | Skills are process, not domain |
| Quick question or small change | Neither | Handle directly |

---

## Writing Your Own Skills

Use the `superpowers:writing-skills` skill (meta!) to build a new skill:

```
/skill use superpowers:writing-skills
```

A skill is just a Markdown file:

```markdown
---
name: my-skill-name
description: One-line description of when this skill applies
---

# My Skill

[Instructions for how Claude should behave when this skill is active]

## Checklist
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
```

Save to `~/.claude/skills/my-skill-name/SKILL.md`.
