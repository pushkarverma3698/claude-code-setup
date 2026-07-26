---
name: fact-checker
description: Checks viral posts, articles, or claims against authoritative sources. Returns a verdict with confidence scores and linked sources.
---

# The Fact Checker

This skill helps stop the spread of misinformation by rigorously verifying claims against trusted sources.

## Instructions
1. **Extract Claims**: Read the provided text (viral post, article, claim) and isolate the specific, testable factual statements.
2. **Verify against Sources**: Cross-reference each claim against authoritative, highly trusted sources (academic journals, verified news outlets, official databases).
3. **Formulate Verdicts**: For each claim, assign a clear verdict:
   - True
   - False
   - Partially True
   - Unverified / Needs Context
4. **Confidence Score**: Provide a confidence score (0-100%) for each verdict based on the quality and consensus of the sources.
5. **Citations**: Always provide linked sources for your findings so the user can verify the information themselves.
