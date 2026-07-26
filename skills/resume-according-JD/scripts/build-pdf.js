const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { CONTACT, RESUME, COVER_LETTER, FILES } = require("./content");

const OUT = process.argv[2] || ".";
const F = FILES || { resumePdf: "Resume.pdf", coverPdf: "Cover_Letter.pdf" };
const NAVY = "#1F3A5F";
const GREY = "#555555";
const BLACK = "#222222";

function newDoc(margin) {
  return new PDFDocument({ size: "LETTER", margins: { top: margin, bottom: margin, left: margin, right: margin } });
}
function contentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function rule(doc, color = NAVY) {
  const y = doc.y + 1;
  doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).lineWidth(1).strokeColor(color).stroke();
  doc.moveDown(0.35);
}

function heading(doc, text) {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY).text(text.toUpperCase(), { characterSpacing: 0.5 });
  rule(doc);
}

function bulletLine(doc, text) {
  const left = doc.page.margins.left;
  const startY = doc.y;
  doc.font("Helvetica").fontSize(9.5).fillColor(BLACK);
  doc.text("•", left + 4, startY, { continued: false, width: 8 });
  doc.text(text, left + 16, startY, { width: contentWidth(doc) - 16, align: "left" });
  doc.moveDown(0.15);
}

function buildResume() {
  const doc = newDoc(40);
  const cw = contentWidth(doc);

  doc.font("Helvetica-Bold").fontSize(22).fillColor(NAVY).text(CONTACT.name, { align: "center", characterSpacing: 1 });
  doc.font("Helvetica").fontSize(12).fillColor("#333333").text(CONTACT.title, { align: "center" });
  doc.moveDown(0.15);
  doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(GREY).text(CONTACT.locationLine, { align: "center" });
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY)
    .text(`${CONTACT.email}  ·  ${CONTACT.phone}  ·  ${CONTACT.linkedin}  ·  ${CONTACT.github}  ·  ${CONTACT.site}`, { align: "center" });

  heading(doc, "Summary");
  doc.font("Helvetica").fontSize(9.5).fillColor(BLACK).text(RESUME.summary, { align: "left", lineGap: 1 });

  heading(doc, "What I Bring");
  RESUME.whatIBring.forEach((b) => bulletLine(doc, b));

  heading(doc, "Skills");
  RESUME.skills.forEach((s) => {
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(BLACK).text(`${s.label}:  `, doc.page.margins.left, y, { continued: true });
    doc.font("Helvetica").fillColor(BLACK).text(s.items, { width: cw });
    doc.moveDown(0.1);
  });

  heading(doc, "Experience");
  RESUME.experience.forEach((e) => {
    doc.moveDown(0.2);
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(BLACK).text(`${e.role}  |  ${e.org}`, doc.page.margins.left, y, { width: cw - 110, continued: false });
    doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(e.dates, doc.page.margins.left, y, { width: cw, align: "right" });
    doc.moveDown(0.1);
    e.bullets.forEach((b) => bulletLine(doc, b));
    if (e.stack) {
      doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(GREY).text(`Stack: ${e.stack}`, { width: cw });
    }
  });

  heading(doc, "Selected Projects");
  RESUME.projects.forEach((p) => {
    doc.moveDown(0.15);
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(BLACK).text(p.name, doc.page.margins.left, y, { continued: true });
    doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(`   ${p.link}`);
    doc.font("Helvetica").fontSize(9).fillColor(BLACK).text(p.desc, { width: cw, lineGap: 0.5 });
  });

  heading(doc, "Education & Certifications");
  const ey = doc.y;
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(BLACK).text(RESUME.education.program, doc.page.margins.left, ey, { width: cw - 80, continued: false });
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(RESUME.education.date, doc.page.margins.left, ey, { width: cw, align: "right" });
  doc.font("Helvetica").fontSize(9).fillColor(GREY).text(`Certifications: ${RESUME.education.certs}`, { width: cw });

  return doc;
}

function buildCoverLetter() {
  const doc = newDoc(64);
  const cw = contentWidth(doc);

  doc.font("Helvetica-Bold").fontSize(17).fillColor(NAVY).text(CONTACT.name);
  doc.font("Helvetica").fontSize(11).fillColor("#333333").text(CONTACT.title);
  doc.moveDown(0.1);
  doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(GREY).text(CONTACT.locationLine);
  doc.font("Helvetica").fontSize(8.5).fillColor(GREY).text(`${CONTACT.email}  ·  ${CONTACT.phone}  ·  ${CONTACT.github}  ·  ${CONTACT.linkedin}`);
  rule(doc);
  doc.moveDown(0.8);

  doc.font("Helvetica").fontSize(11).fillColor(BLACK).text(COVER_LETTER.greeting);
  doc.moveDown(0.6);
  COVER_LETTER.paragraphs.forEach((p) => {
    doc.font("Helvetica").fontSize(10.5).fillColor(BLACK).text(p, { align: "justify", lineGap: 2, width: cw });
    doc.moveDown(0.55);
  });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(11).fillColor(BLACK).text(COVER_LETTER.signoff);
  const nameProper = CONTACT.name.replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase());
  doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY).text(nameProper);

  return doc;
}

function save(doc, name) {
  return new Promise((resolve) => {
    const stream = fs.createWriteStream(path.join(OUT, name));
    doc.pipe(stream);
    doc.end();
    stream.on("finish", () => { console.log("wrote", name); resolve(); });
  });
}

(async () => {
  await save(buildResume(), F.resumePdf || "Resume.pdf");
  await save(buildCoverLetter(), F.coverPdf || "Cover_Letter.pdf");
})();
