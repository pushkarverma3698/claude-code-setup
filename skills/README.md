# Community Skills

This setup uses 15 community skills on top of the 14 Superpowers skills. Skills are invoked before taking action — they provide the methodology, not just the execution.

## Install Superpowers First

The Superpowers plugin provides the core 14 skills and the auto-invocation framework. Install it first:

```
/plugin install superpowers@claude-plugins-official
```

## Community Skills

| Skill | Purpose | Install |
|-------|---------|---------|
| `brand-guidelines` | Enforce brand voice, colors, and tone rules across all outputs | `/skills install brand-guidelines` |
| `deep-research` | Multi-agent research synthesis across many sources into a comprehensive report | `/skills install deep-research` |
| `fact-checker` | Verify claims against authoritative sources, returns confidence scores + sources | `/skills install fact-checker` |
| `find-skill` | Natural language skill discovery — "find a skill for X" → returns the right skill | `/skills install find-skill` |
| `find-skills` | Browse and install new skills from the marketplace | Built-in with Superpowers |
| `frontend-design` | Production-grade UI using an official design system — no "AI slop" | `/skills install frontend-design` |
| `humanizer` | Remove documented AI writing patterns from text, rewrite to sound genuinely human | `/skills install humanizer` |
| `mcp-builder` | Build high-quality MCP servers (Python FastMCP or Node SDK) with Claude's guidance | `/skills install mcp-builder` |
| `office-hours` | Y Combinator partner-style forcing questions to pressure-test your business idea | `/skills install office-hours` |
| `seo-skill` | Full technical SEO audit, competitor comparison, prioritized fixes | `/skills install seo-skill` |
| `skill-creator` | Interview-driven skill builder — interviews you about your workflow, creates a custom skill | `/skills install skill-creator` |
| `systematic-debugging` | Structured 4-phase root cause analysis for complex bugs and production incidents | `/skills install systematic-debugging` |
| `token-optimization` | Process large documents using a fraction of tokens while maintaining quality | `/skills install token-optimization` |
| `ui-ux-pro-max` | Production-grade UI/UX design, review, and optimization | `/skills install ui-ux-pro-max` |
| `webapp-testing` | Comprehensive web application testing with user flow documentation and defect reporting | `/skills install webapp-testing` |

## The Priority Order

From `CLAUDE.md`:

```
Priority Order (DO THIS BEFORE IMPLEMENTING):
1. Check available skills — use whenever they match, even partially
2. Check available agents — spawn for domain-specific depth
3. Check available MCP servers — use for external data/actions
4. Implement manually ONLY if none of the above apply
```

The key: checking for a skill takes 2 seconds. Skipping it and writing code that turns out to be worse than the skill's approach wastes 20 minutes.

## Creating Your Own Skills

Use the `skill-creator` skill to build custom skills tailored to your workflow:

```
/skill use skill-creator
```

Or use the `superpowers:writing-skills` skill for a more structured creation process:

```
/skill use superpowers:writing-skills
```

Skills are Markdown files saved to `~/.claude/skills/{skill-name}/SKILL.md`. They can be simple (a checklist) or complex (a multi-phase workflow with conditional branches).
