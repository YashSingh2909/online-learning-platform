import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateCertificate = (studentName, courseName, completionDate, certificateId) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [1024, 768],
        orientation: 'landscape',
      });

      const filename = `certificate-${certificateId}.pdf`;
      const filepath = path.join(process.cwd(), 'certificates', filename);

      // Ensure certificates directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'certificates'))) {
        fs.mkdirSync(path.join(process.cwd(), 'certificates'), { recursive: true });
      }

      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Add border
      doc.rect(20, 20, 984, 728).stroke();
      doc.rect(30, 30, 964, 708).stroke();

      // Title
      doc.fontSize(48).font('Helvetica-Bold').text('Certificate of Completion', 100, 100, { align: 'center' });

      // Decorative line
      doc.moveTo(200, 200).lineTo(824, 200).stroke();

      // Course name
      doc.fontSize(32).font('Helvetica-Bold').text(`${courseName}`, 100, 280, { align: 'center' });

      // Certificate text
      doc.fontSize(18).font('Helvetica').text('This is to certify that', 100, 380, { align: 'center' });

      // Student name
      doc.fontSize(28).font('Helvetica-Bold').text(studentName, 100, 430, { align: 'center' });

      // Completion message
      doc.fontSize(16).font('Helvetica').text('has successfully completed the course', 100, 500, { align: 'center' });

      // Decorative line
      doc.moveTo(200, 550).lineTo(824, 550).stroke();

      // Date and Certificate ID
      const dateStr = new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc.fontSize(12).font('Helvetica');
      doc.text(`Date: ${dateStr}`, 100, 600);
      doc.text(`Certificate ID: ${certificateId}`, 824, 600, { align: 'right' });

      // EduSphere signature area
      doc.text('EduSphere', 100, 680);
      doc.text('Online Learning Platform', 100, 700);

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};
