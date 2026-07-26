---
name: mcp-builder
description: Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
license: Complete terms in LICENSE.txt
---

# MCP Server Development Guide

## Overview

To create high-quality MCP (Model Context Protocol) servers that enable LLMs to effectively interact with external services, use this skill. An MCP server provides tools that allow LLMs to access external services and APIs. The quality of an MCP server is measured by how well it enables LLMs to accomplish real-world tasks using the tools provided.

---

# Process

## 🚀 High-Level Workflow

Creating a high-quality MCP server involves four main phases:

### Phase 1: Deep Research and Planning

#### 1.1 Understand Agent-Centric Design Principles

Before diving into implementation, understand how to design tools for AI agents:

**Build for Workflows, Not Just API Endpoints:**
- Don't simply wrap existing API endpoints - build thoughtful, high-impact workflow tools
- Consolidate related operations (e.g., `schedule_event` that both checks availability and creates event)
- Focus on tools that enable complete tasks, not just individual API calls

**Optimize for Limited Context:**
- Agents have constrained context windows - make every token count
- Return high-signal information, not exhaustive data dumps
- Provide "concise" vs "detailed" response format options
- Default to human-readable identifiers over technical codes (names over IDs)

**Design Actionable Error Messages:**
- Error messages should guide agents toward correct usage patterns
- Suggest specific next steps: "Try using filter='active_only' to reduce results"

**Follow Natural Task Subdivisions:**
- Tool names should reflect how humans think about tasks
- Group related tools with consistent prefixes for discoverability

#### 1.2 Study MCP Protocol Documentation

Fetch the latest MCP protocol documentation:
`https://modelcontextprotocol.io/llms-full.txt`

#### 1.3 Study Framework Documentation

- **MCP Best Practices**: `reference/mcp_best_practices.md`
- **Python SDK**: fetch `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- **Python Guide**: `reference/python_mcp_server.md`
- **TypeScript SDK**: fetch `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- **TypeScript Guide**: `reference/node_mcp_server.md`

#### 1.4 Exhaustively Study API Documentation

Read ALL available API documentation for the service you're integrating:
- Official API reference, auth requirements, rate limiting, pagination, error responses

#### 1.5 Create Implementation Plan

**Tool Selection:** List most valuable endpoints, prioritize tools enabling common workflows.

**Input/Output Design:**
- Pydantic models (Python) or Zod schemas (TypeScript) for validation
- Consistent response formats with configurable detail levels
- Character limits and truncation strategies (~25,000 tokens)

---

### Phase 2: Implementation

#### 2.1 Project Structure

**Python:**
- Single `.py` file or modules for complex servers
- MCP Python SDK for tool registration
- Pydantic models for input validation

**Node/TypeScript:**
- Proper `package.json` and `tsconfig.json`
- MCP TypeScript SDK
- Zod schemas for input validation

#### 2.2 Core Infrastructure First

Before tools, create shared utilities:
- API request helpers, error handling, response formatting, pagination, auth management

#### 2.3 Tool Implementation Pattern

For each tool:
1. Define input schema (Pydantic/Zod) with constraints and descriptions
2. Write comprehensive docstrings: summary, parameters, return types, examples, error handling
3. Implement with async/await, proper error handling, multiple response formats
4. Add tool annotations: `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`

#### 2.4 Testing

**IMPORTANT:** MCP servers are long-running processes — running directly will hang indefinitely.

Safe testing approaches:
- Run server in tmux, test via evaluation harness
- Use `timeout 5s python server.py` for quick syntax checks
- Python: `python -m py_compile server.py`
- TypeScript: `npm run build`

---

### Phase 3: Review

- **DRY**: No duplicated code
- **Consistency**: Similar operations return similar formats
- **Error Handling**: All external calls wrapped
- **Type Safety**: Full type coverage

---

### Phase 4: Create Evaluations

Create 10 evaluation questions per `reference/evaluation.md`:
- Independent, read-only, complex (multi-tool), realistic, verifiable, stable

Output as XML:
```xml
<evaluation>
  <qa_pair>
    <question>...</question>
    <answer>...</answer>
  </qa_pair>
</evaluation>
```

---

# Reference Files

Load these as needed:
- `reference/mcp_best_practices.md` — Universal MCP guidelines
- `reference/python_mcp_server.md` — Python/FastMCP complete guide
- `reference/node_mcp_server.md` — TypeScript complete guide
- `reference/evaluation.md` — Evaluation creation guide
