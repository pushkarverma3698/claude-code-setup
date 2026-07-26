---
name: resume-according-JD
description: >-
  Tailor a resume and cover letter to a specific job description (or a known
  role when the company is unknown), then export both as polished DOCX and PDF.
  Use this whenever the user wants to adapt, rewrite, optimize, or target their
  CV/resume and/or cover letter for a particular job, company, role, or region
  — including phrases like "make my resume for this JD", "tailor my CV for a
  full-stack role", "I got a referral, fix my resume", "write a cover letter for
  this posting", or "give me a US/EU variant of my resume". Trigger even when
  the user only mentions a job application, a referral, or a target role and has
  existing resume/CV/cover-letter files somewhere on disk. Produces human-sounding
  documents that pass senior-engineer scrutiny and don't read as AI-generated.
---

# Resume According to JD

Turn an existing resume + cover letter into a version tailored to a specific
role, then ship clean DOCX and PDF files. The output has to do two jobs at once:
survive a recruiter/ATS skim **and** impress the senior engineer who reads it
properly. That means real positioning decisions, not keyword stuffing, and prose
that sounds like a person wrote it.

## The pipeline

Follow these phases in order. Each one exists because skipping it produces a
worse document, and the reasons are spelled out so you can adapt sensibly.

### 1. Brainstorm the positioning (do not skip)

Before writing a word, lock the framing. Invoke the `brainstorming` skill if the
intent is at all fuzzy. The point is that a resume is an argument, and you can't
write a good argument until you know what you're arguing. Get clear answers to:

- **The target.** What role, seniority, and (if known) company/JD? If the company
  is unknown, treat the role itself as the target and keep the documents
  **company-agnostic** — no `[COMPANY]` placeholders, no fabricated hooks. A
  letter full of brackets reads as a draft; a clean general letter reads as
  finished.
- **The selling point / thesis.** What is the one thing this candidate wants the
  reader to believe? (e.g. "ships end-to-end," "deep specialist," "fast learner
  who's done it before.") This is *internal framing* — communicate it through
  demonstrated work, never as a literal boast. "I can build anything" on the page
  reads as insecurity; a track record of building varied things reads as range.
- **Emphasis balance.** If the person has two strengths (e.g. full-stack + AI),
  decide whether they're equal-weight or one leads. Ask — don't guess.
- **Logistics.** Location / work mode (remote, relocation, visa), region (US vs
  EU spelling and length norms), and desired length (US norm: resume ~1 page for
  juniors, ~1.5 for mid/senior; cover letter always 1 page).
- **Output location.** Where should the files land?

Use the `AskUserQuestion` tool for the 2–4 decisions that genuinely change the
output. Don't ask about things you can reasonably default.

### 2. Gather source material in parallel

The user almost always has more material than the one file they mentioned —
older resume variants, a LinkedIn "about," project READMEs, a personal knowledge
base. These are gold for specific, credible detail. Use the
`dispatching-parallel-agents` skill to fan out `Explore` agents (read-only) that
locate and extract **full text** from every relevant source at once:

- the resume and cover letter the user pointed at,
- any sibling/variant docs (check the folder they mentioned and `~/Projects`,
  `~/Downloads`),
- supporting docs (project READMEs, GitHub/LinkedIn profiles),
- if a personal-knowledge MCP exists (e.g. `personal-rag`), one agent can query
  it for career facts, but the user's own docs are the primary source.

Reconcile contradictions between variants (e.g. one says "WhatsApp booking," another
"email booking") by choosing the safest phrasing or asking. Never ship a
contradiction across the two documents.

### 3. Draft both documents

Write the content as plain structured data first (see `scripts/content.template.js`),
not as formatted files — separating content from rendering keeps the loop fast.

**Resume principles:**
- Lead with the targeted title, not whatever the old resume said.
- Order skills/sections to reinforce the thesis (e.g. if positioning full-stack,
  Frontend/Backend lead, niche skills follow — even if AI is the flashier work).
- Keep quantified wins (perf %, cost %, scale). Numbers are what senior readers trust.
- Match region: US → "optimize," 1–1.5 pages; UK/EU → "optimise," CV norms differ.
- Cut anything irrelevant to *this* role. Tailoring is mostly subtraction.

**Cover letter principles:**
- **Never restate the resume.** The resume lists *what*; the letter shows *how
  they think*. Open with a concrete moment (a thing they built/fixed/owned), not
  "I am writing to apply for…" or a self-taught origin cliché.
- One page, ~320–380 words. Tighter is better.
- End grounded and specific to the kind of work, not the company (when unknown).
- Confident, not boastful. The difference is evidence: show the work and let the
  reader conclude the candidate is good.

### 4. Humanize (mandatory)

AI-written application docs have tells — triads, "leverage," "passion for,"
"I am excited to," uniform sentence length, hollow adjectives. A senior engineer
spots them instantly and it kills credibility. Run the `humanizer` skill over
**both** drafts and revise: vary sentence length, cut fluff, allow opinion and
contractions, prefer concrete over abstract. This step is not optional — it's the
difference between "passes" and "obviously generated."

### 5. Export to DOCX + PDF

Use the bundled scripts so you don't rebuild a generator each time. They render
the same `content.js` to both formats with consistent, ATS-friendly styling
(standard fonts, real headings, no text boxes).

```bash
# one-time per machine, in a scratch build dir:
npm install docx pdfkit

# then, with content.js filled in:
node build-docx.js "/abs/path/to/output/folder"
node build-pdf.js  "/abs/path/to/output/folder"
```

- Copy `scripts/content.template.js` → `content.js` and fill it with the drafted,
  humanized content.
- Copy `scripts/build-docx.js` and `scripts/build-pdf.js` alongside it.
- If no LibreOffice/pandoc is available, this pdfkit path still works (pure Node).
- Output filenames: `<Name>_Resume_<Variant>.{docx,pdf}` and
  `<Name>_Cover_Letter_<Variant>.{docx,pdf}`.

### 6. Verify before claiming done

Open both PDFs (the `Read` tool renders them) and confirm:
- resume within the agreed length, cover letter exactly 1 page,
- correct region spelling, no stale/old-target framing left over,
- no `[PLACEHOLDER]` and no company name when the company is unknown,
- the cover letter shares no sentence verbatim with the resume,
- links and contact details intact.

Fix and regenerate rather than reporting "done" on an unverified file.

## Files

- `scripts/content.template.js` — the content model to fill (resume + letter).
- `scripts/build-docx.js` — renders `content.js` → two DOCX files.
- `scripts/build-pdf.js` — renders `content.js` → two PDF files (pdfkit, no LibreOffice needed).

## Notes on tone (the thing that actually matters)

Most resume generators fail not on formatting but on voice. The reader is a busy
engineer who has seen a thousand of these. Specific beats generic every time:
"took over a stalled rebuild and got it to production" lands; "results-driven
team player" doesn't. When in doubt, show the work and shut up — let the evidence
carry the confidence.
