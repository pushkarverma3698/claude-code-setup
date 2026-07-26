// content.template.js — copy this to content.js and fill it with the drafted,
// HUMANIZED content for the target candidate + role. build-docx.js and
// build-pdf.js both read this single model so the DOCX and PDF stay identical.
//
// Voice rules (don't skip — this is what makes it pass a senior engineer):
//  - Specific over generic. Show the work; never state "I can build anything".
//  - Vary sentence length. Allow contractions and a little opinion.
//  - No "leverage", "passion for", "results-driven", "I am excited to", triads.
//  - Keep numbers (perf %, cost %, scale) — they're what readers trust.
//  - Resume bullets and cover-letter sentences must NOT overlap verbatim.

// Output filenames. Use <Name>_Resume_<Variant> / <Name>_Cover_Letter_<Variant>.
const FILES = {
  resume: "Firstname_Lastname_Resume_Variant.docx",
  cover: "Firstname_Lastname_Cover_Letter_Variant.docx",
  resumePdf: "Firstname_Lastname_Resume_Variant.pdf",
  coverPdf: "Firstname_Lastname_Cover_Letter_Variant.pdf",
};

const CONTACT = {
  name: "FIRST LAST",                 // rendered uppercase in the header
  title: "Target Role Title",         // lead with the TARGETED title, not the old one
  locationLine: "Remote · location · time-zone note",  // or relocation/visa note; keep to one line
  email: "you@example.com",
  phone: "+1 555 555 5555",
  linkedin: "linkedin.com/in/handle",
  github: "github.com/handle",
  site: "yoursite.com",
};

const RESUME = {
  // 2–4 sentences. Lead with the thesis; weave region-correct spelling.
  summary: "…",

  // 3–5 punchy, concrete bullets. What this person reliably delivers.
  whatIBring: ["…", "…", "…"],

  // Order to reinforce the thesis (e.g. Frontend/Backend first if positioning full-stack).
  skills: [
    { label: "Frontend", items: "…" },
    { label: "Backend", items: "…" },
    { label: "Data", items: "…" },
    { label: "Cloud / DevOps", items: "…" },
    // add/trim groups to fit the role; cut anything irrelevant to THIS job
  ],

  experience: [
    {
      role: "Role",
      org: "Company — Division",
      dates: "Mon YYYY – Present",
      bullets: ["…", "…"],          // action + outcome; keep quantified wins
      stack: "comma-separated stack, or null",
    },
    // most recent / most relevant first
  ],

  projects: [
    { name: "Project — what it is", link: "url or location", desc: "one or two lines, concrete" },
  ],

  education: {
    program: "Program / Degree — Institution",
    date: "Mon YYYY",
    certs: "Cert · Cert · Cert",     // or "" to omit
  },
};

// One page, ~320–380 words. Open with a concrete moment, NOT "I am writing to apply".
// No company name when the company is unknown. No placeholders. End grounded.
const COVER_LETTER = {
  greeting: "Dear Hiring Team,",
  paragraphs: ["…", "…", "…", "…", "…"],
  signoff: "Best regards,",
};

module.exports = { CONTACT, RESUME, COVER_LETTER, FILES };
