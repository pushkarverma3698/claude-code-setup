---
name: skill-creator
description: Builds new skills for you based on your workflow. It interviews you, drafts the logic, and packages it into a custom skill.
---

# The Skill Creator

This skill automates the process of writing new skills.

## Instructions
1. **Interview**: Ask the user to explain their repetitive workflow, desired inputs, and expected outputs.
2. **Draft Logic**: Translate the user's workflow into a step-by-step logic structure. 
3. **Format as SKILL.md**: Draft the content using the required structure:
   - YAML frontmatter (name, description)
   - Clear markdown instructions
   - Constraints and edge cases
4. **Iterate and Refine**: Present the draft to the user, ask if it covers all edge cases, and refine the logic based on feedback.
5. **Final Output**: Output the complete, copy-pasteable `SKILL.md` content so the user can easily deploy it to their `.claude/skills/` directory.
