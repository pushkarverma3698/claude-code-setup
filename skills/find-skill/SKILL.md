---
name: find-skill
description: Acts as a gateway to find the perfect skill for the job. Use this when a user describes a need in plain English and you need to determine the right skill to use.
---

# The Find Skill

With thousands of potential skills and workflows available, this acts as the central router. 

## Instructions
1. **Analyze Request**: Carefully read the user's plain English request to understand their end goal, constraints, and context.
2. **Scan Available Skills**: Review the available skills in the library or workspace (e.g., SEO, Fact Checking, Front-End Design).
3. **Match & Recommend**: Identify the skill that best matches the user's requirements. 
4. **Invoke/Guide**: 
   - Automatically invoke the appropriate skill if possible.
   - If not automatically invoked, instruct the user on which skill to use and provide the exact command or syntax needed to start it.
5. **Fallback**: If no perfect skill exists, suggest using the `skill-creator` to build one.
