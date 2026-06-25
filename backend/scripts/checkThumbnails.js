/**
 * Quick script to check current thumbnail status
 */

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Course from '../models/Course.js';

dotenv.config();

const checkThumbnails = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const courses = await Course.find({}, 'title thumbnail category level').limit(5);
    
    console.log('\nSample courses:');
    courses.forEach(c => {
      console.log(`Title: ${c.title}`);
      console.log(`Thumbnail: ${c.thumbnail ? c.thumbnail.substring(0, 50) + '...' : 'EMPTY'}`);
      console.log(`Category: ${c.category}, Level: ${c.level}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkThumbnails();