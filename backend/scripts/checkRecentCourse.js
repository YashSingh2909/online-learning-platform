/**
 * Check the most recently created course thumbnail
 */

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Course from '../models/Course.js';

dotenv.config();

const checkRecentCourse = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const course = await Course.findOne().sort({ createdAt: -1 });
    
    if (!course) {
      console.log('No courses found');
      process.exit(0);
    }

    console.log(`\nMost recent course: ${course.title}`);
    console.log(`Created at: ${course.createdAt}`);
    console.log(`\nThumbnail data:`);
    console.log(`Length: ${course.thumbnail ? course.thumbnail.length : 0}`);
    console.log(`First 300 chars: ${course.thumbnail ? course.thumbnail.substring(0, 300) : 'EMPTY'}`);
    console.log(`Starts with data:image/svg+xml;base64,: ${course.thumbnail ? course.thumbnail.startsWith('data:image/svg+xml;base64,') : false}`);
    
    if (course.thumbnail && course.thumbnail.startsWith('data:image/svg+xml;base64,')) {
      const Buffer = (await import('buffer')).Buffer;
      const base64Data = course.thumbnail.replace('data:image/svg+xml;base64,', '');
      const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8');
      console.log(`\nDecoded SVG (first 400 chars):`);
      console.log(svgContent.substring(0, 400));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkRecentCourse();