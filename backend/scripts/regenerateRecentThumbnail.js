/**
 * Regenerate thumbnail for the most recent course
 */

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Course from '../models/Course.js';
import { getCourseThumbnail } from '../utils/thumbnailGenerator.js';

dotenv.config();

const regenerateRecentThumbnail = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const course = await Course.findOne().sort({ createdAt: -1 });
    
    if (!course) {
      console.log('No courses found');
      process.exit(0);
    }

    console.log(`\nRegenerating thumbnail for: ${course.title}`);
    console.log(`Category: ${course.category}, Level: ${course.level}`);
    
    const newThumbnail = getCourseThumbnail(null, course.category, course.level);
    
    course.thumbnail = newThumbnail;
    await course.save();
    
    console.log(`\n✅ Thumbnail regenerated successfully!`);
    console.log(`New thumbnail length: ${newThumbnail.length}`);
    console.log(`First 200 chars: ${newThumbnail.substring(0, 200)}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

regenerateRecentThumbnail();