/**
 * Generate test thumbnails for different categories and levels
 */

import { getCourseThumbnail } from '../utils/thumbnailGenerator.js';
import fs from 'fs';
import path from 'path';

const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Language'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const generateTestThumbnails = () => {
  const outputDir = path.join(process.cwd(), 'scripts', 'test-thumbnails');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let count = 0;
  
  categories.forEach(category => {
    levels.forEach(level => {
      const thumbnail = getCourseThumbnail(null, category, level);
      const filename = `${category.toLowerCase()}-${level.toLowerCase()}.txt`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, thumbnail);
      console.log(`Generated: ${filename}`);
      count++;
    });
  });

  console.log(`\n✅ Generated ${count} test thumbnails in: ${outputDir}`);
  console.log('Each file contains the data URL - you can paste it into a browser to view');
};

generateTestThumbnails();