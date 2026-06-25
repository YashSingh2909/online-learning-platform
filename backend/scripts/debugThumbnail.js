/**
 * Debug script to check thumbnail generation
 */

import { getCourseThumbnail } from '../utils/thumbnailGenerator.js';

const testThumbnail = getCourseThumbnail(null, 'Programming', 'Beginner');

console.log('Generated thumbnail:');
console.log('Length:', testThumbnail.length);
console.log('First 200 chars:', testThumbnail.substring(0, 200));
console.log('Starts with data:image/svg+xml;base64,:', testThumbnail.startsWith('data:image/svg+xml;base64,'));

// Decode and check the SVG
const base64Data = testThumbnail.replace('data:image/svg+xml;base64,', '');
const Buffer = (await import('buffer')).Buffer;
const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8');

console.log('\nDecoded SVG (first 500 chars):');
console.log(svgContent.substring(0, 500));

process.exit(0);