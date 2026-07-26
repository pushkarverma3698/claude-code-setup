const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle,
  TabStopType, TabStopPosition,
} = require("docx");
const { CONTACT, RESUME, COVER_LETTER, FILES } = require("./content");

const OUT = process.argv[2] || ".";
const F = FILES || { resume: "Resume.docx", cover: "Cover_Letter.docx" };
const NAVY = "1F3A5F";
const GREY = "555555";
const FONT = "Calibri";

const ruleBorder = { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 2 } };

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    border: ruleBorder,
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: NAVY, size: 22, font: FONT })],
  });
}

function headerBlock() {
  const contacts = `${CONTACT.email}  ·  ${CONTACT.phone}  ·  ${CONTACT.linkedin}  ·  ${CONTACT.github}  ·  ${CONTACT.site}`;
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 },
      children: [new TextRun({ text: CONTACT.name, bold: true, size: 40, color: NAVY, font: FONT })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
      children: [new TextRun({ text: CONTACT.title, size: 24, color: "333333", font: FONT })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 },
      children: [new TextRun({ text: CONTACT.locationLine, size: 17, italics: true, color: GREY, font: FONT })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: contacts, size: 17, color: GREY, font: FONT })] }),
  ];
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 30 },
    children: [new TextRun({ text, size: 20, font: FONT })],
  });
}

function buildResume() {
  const children = [...headerBlock()];

  children.push(sectionHeading("Summary"));
  children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: RESUME.summary, size: 20, font: FONT })] }));

  children.push(sectionHeading("What I Bring"));
  RESUME.whatIBring.forEach((b) => children.push(bullet(b)));

  children.push(sectionHeading("Skills"));
  RESUME.skills.forEach((s) => {
    children.push(new Paragraph({
      spacing: { after: 30 },
      children: [
        new TextRun({ text: `${s.label}:  `, bold: true, size: 20, font: FONT }),
        new TextRun({ text: s.items, size: 20, font: FONT }),
      ],
    }));
  });

  children.push(sectionHeading("Experience"));
  RESUME.experience.forEach((e) => {
    children.push(new Paragraph({
      spacing: { before: 120, after: 10 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: [
        new TextRun({ text: `${e.role}  |  ${e.org}`, bold: true, size: 21, font: FONT }),
        new TextRun({ text: `\t${e.dates}`, size: 18, color: GREY, font: FONT }),
      ],
    }));
    e.bullets.forEach((b) => children.push(bullet(b)));
    if (e.stack) {
      children.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "Stack: ", bold: true, italics: true, size: 18, color: GREY, font: FONT }),
          new TextRun({ text: e.stack, italics: true, size: 18, color: GREY, font: FONT }),
        ],
      }));
    }
  });

  children.push(sectionHeading("Selected Projects"));
  RESUME.projects.forEach((p) => {
    children.push(new Paragraph({
      spacing: { before: 60, after: 10 },
      children: [
        new TextRun({ text: p.name, bold: true, size: 20, font: FONT }),
        new TextRun({ text: `   ${p.link}`, size: 17, color: GREY, font: FONT }),
      ],
    }));
    children.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: p.desc, size: 19, font: FONT })] }));
  });

  children.push(sectionHeading("Education & Certifications"));
  children.push(new Paragraph({
    spacing: { after: 10 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: RESUME.education.program, bold: true, size: 20, font: FONT }),
      new TextRun({ text: `\t${RESUME.education.date}`, size: 18, color: GREY, font: FONT }),
    ],
  }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Certifications: ${RESUME.education.certs}`, size: 19, color: GREY, font: FONT })] }));

  return new Document({
    numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: "bullet", text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 200 } } } }] }] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children,
    }],
  });
}

function buildCoverLetter() {
  const contacts = `${CONTACT.email}  ·  ${CONTACT.phone}  ·  ${CONTACT.github}  ·  ${CONTACT.linkedin}`;
  const children = [
    new Paragraph({ spacing: { after: 10 }, children: [new TextRun({ text: CONTACT.name, bold: true, size: 32, color: NAVY, font: FONT })] }),
    new Paragraph({ spacing: { after: 10 }, children: [new TextRun({ text: CONTACT.title, size: 21, color: "333333", font: FONT })] }),
    new Paragraph({ spacing: { after: 6 }, children: [new TextRun({ text: CONTACT.locationLine, size: 17, italics: true, color: GREY, font: FONT })] }),
    new Paragraph({ border: ruleBorder, spacing: { after: 200 }, children: [new TextRun({ text: contacts, size: 17, color: GREY, font: FONT })] }),
    new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: COVER_LETTER.greeting, size: 21, font: FONT })] }),
  ];
  COVER_LETTER.paragraphs.forEach((p) => {
    children.push(new Paragraph({ spacing: { after: 140, line: 276 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: p, size: 21, font: FONT })] }));
  });
  children.push(new Paragraph({ spacing: { before: 120, after: 10 }, children: [new TextRun({ text: COVER_LETTER.signoff, size: 21, font: FONT })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: CONTACT.name.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase()), bold: true, size: 21, color: NAVY, font: FONT })] }));

  return new Document({
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 } } },
      children,
    }],
  });
}

async function write(doc, name) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log("wrote", name);
}

(async () => {
  await write(buildResume(), F.resume || "Resume.docx");
  await write(buildCoverLetter(), F.cover || "Cover_Letter.docx");
})();
