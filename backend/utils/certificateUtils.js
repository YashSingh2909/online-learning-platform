import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Generates a single-page (A4 landscape) PDF certificate.
 * Bottom layout redesign: reserved bottom 20% for footer + 3 signature blocks with fixed coordinates.
 */
export const generateCertificate = (studentName, courseName, completionDate, certificateId) => {
  return new Promise((resolve, reject) => {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const repoRoot = path.resolve(__dirname, '..', '..');
      const dirPath = path.join(repoRoot, 'certificates');
      fs.mkdirSync(dirPath, { recursive: true });

      const filename = `certificate-${certificateId}.pdf`;
      const filepath = path.join(dirPath, filename);

      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
      });

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Border frame (double border) — keep everything inside inner border padding
      const outerPad = 20;
      const innerPad = 32;
      const innerLeft = outerPad + (innerPad - outerPad);
      const innerTop = outerPad + (innerPad - outerPad);
      const innerWidth = pageWidth - 2 * innerPad;
      const innerHeight = pageHeight - 2 * innerPad;

      // Double border
      doc.lineWidth(2).strokeColor('#1f2937');
      doc.rect(outerPad, outerPad, pageWidth - 2 * outerPad, pageHeight - 2 * outerPad).stroke();
      doc.lineWidth(1).strokeColor('#111827');
      doc.rect(innerPad, innerPad, pageWidth - 2 * innerPad, pageHeight - 2 * innerPad).stroke();

      // ---- Main content (kept away from bottom 20% area) ----
      const mainBottom = innerPad + innerHeight * 0.80; // reserve bottom 20% inside inner border

      // Branding
      doc.font('Helvetica-Bold').fontSize(20).fillColor('#111827').text('EduSphere', 0, 40, { align: 'center' });
      doc.font('Helvetica').fontSize(12).fillColor('#374151').text('Online Learning Platform', 0, 62, { align: 'center' });

      // Title
      doc.font('Times-Bold').fontSize(46).fillColor('#111827').text('Certificate of Completion', 0, 120, { align: 'center' });


      doc.strokeColor('#111827').moveTo(pageWidth * 0.25, 175).lineTo(pageWidth * 0.75, 175).stroke();

      // Statement + names
      doc.font('Helvetica').fontSize(18).fillColor('#111827').text('This is to certify that', 0, 200, { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(34).fillColor('#111827').text(studentName, 0, 240, { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(22).fillColor('#111827').text(courseName, 0, 295, { align: 'center' });
      doc.font('Helvetica').fontSize(16).fillColor('#111827').text('has successfully completed the course', 0, 335, { align: 'center' });

      // ---- Footer block (above signatures) ----
      // Redesign only bottom 25%: use calculated coordinates and increase vertical separation.
      // Reserve bottom 25% inside inner border for footer + signatures.
      const bottomReserveStartY = innerTop + innerHeight * 0.75;

      // Footer text block sits at the top of bottom reserve.
      const footerTextBlockTopY = bottomReserveStartY + 10;
      const footerTextY1 = footerTextBlockTopY; // Date:
      const footerTextY2 = footerTextBlockTopY + 18; // Certificate ID (20px-ish gap)

      const dateStr = new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Date + Certificate ID aligned left within inner border
      const footerLeftX = innerPad + 10;
      doc.font('Helvetica').fontSize(12).fillColor('#374151');
      doc.text(`Date: ${dateStr}`, footerLeftX, footerTextY1);
      doc.text(`Certificate ID: ${certificateId}`, footerLeftX, footerTextY2);

      // ---- Signatures (2 blocks: Instructor + Platform) ----
      // Move signatures upward and ensure they fit fully inside the inner border.
      // This fixes the previous right overflow caused by 3-block coordinate math.
      const signatureTopPadding = 18; // space below the footer block
      const signatureLineY = footerTextY2 + signatureTopPadding + 28;
      const signatureLabelY = signatureLineY + 14;

      // Use dynamic width based on innerWidth so both blocks remain inside inner border.
      // Keep equal widths and equal gaps for symmetry.
      const blocksWidth = innerWidth * 0.28;
      const totalBlocksWidth = blocksWidth * 2;
      const blocksGap = (innerWidth - totalBlocksWidth) / 3; // equal side gaps + middle gap

      const instructorBlockLeftX = innerPad + blocksGap;
      const platformBlockLeftX = instructorBlockLeftX + blocksWidth + blocksGap;

      // Draw lines (equal length)
      doc.lineWidth(1).strokeColor('#111827');
      doc.moveTo(instructorBlockLeftX, signatureLineY)
        .lineTo(instructorBlockLeftX + blocksWidth, signatureLineY)
        .stroke();
      doc.moveTo(platformBlockLeftX, signatureLineY)
        .lineTo(platformBlockLeftX + blocksWidth, signatureLineY)
        .stroke();

      // Labels centered exactly under lines
      doc.font('Helvetica').fontSize(12).fillColor('#111827');
      doc.text('Instructor Signature', instructorBlockLeftX, signatureLabelY, { width: blocksWidth, align: 'center' });
      doc.text('Platform Signature', platformBlockLeftX, signatureLabelY, { width: blocksWidth, align: 'center' });




      doc.end();

      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

