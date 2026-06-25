/**
 * View the full SVG content of the most recent course
 */

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Course from '../models/Course.js';

dotenv.config();

const viewFullSvg = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const course = await Course.findOne().sort({ createdAt: -1 });
    
    if (!course || !course.thumbnail) {
      console.log('No course or thumbnail found');
      process.exit(0);
    }

    if (course.thumbnail.startsWith('data:image/svg+xml;base64,')) {
      const Buffer = (await import('buffer')).Buffer;
      const base64Data = course.thumbnail.replace('data:image/svg+xml;base64,', '');
      const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8');
      console.log(`\nFull SVG content for course: ${course.title}`);
      console.log('='.repeat(80));
      console.log(svgContent);
      console.log('='.repeat(80));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

viewFullSvg();