/**
 * Auto-generated course thumbnail system
 * Creates category-based SVG icons with level-based color themes
 */

// Category icon SVG paths (clean, professional icons)
const categoryIcons = {
  Programming: {
    viewBox: '0 0 24 24',
    path: '<path d="M14.447 3.027a.75.75 0 0 1 .525.92l-4.5 16.5a.75.75 0 0 1-1.447-.392l4.5-16.5a.75.75 0 0 1 .922-.528ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 1 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" />'
  },
  Design: {
    viewBox: '0 0 24 24',
    path: '<path d="M12 1.5a.75.75 0 0 1 .75.75V7.5h-1.5V2.25A.75.75 0 0 1 12 1.5ZM11.25 7.5v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V7.5h3.75a.75.75 0 0 0 0-1.5h-9a.75.75 0 0 0 0 1.5h3.75ZM12 13.5a.75.75 0 0 1 .75.75v5.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V14.25A.75.75 0 0 1 12 13.5Z" />'
  },
  Business: {
    viewBox: '0 0 24 24',
    path: '<path d="M3.375 4.875c0-1.036.84-1.875 1.875-1.875h13.5c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875h-3.75V18h3.75a3.375 3.375 0 0 0 3.375-3.375V4.875A3.375 3.375 0 0 0 18.75 1.5H5.25A3.375 3.375 0 0 0 1.875 4.875v9.75A3.375 3.375 0 0 0 5.25 18h3.75v-1.5H5.25a1.875 1.875 0 0 1-1.875-1.875V4.875ZM10.5 7.5h2.25v1.5h-2.25V7.5Zm-3.75 0h1.5v1.5h-1.5V7.5Zm7.5 0h1.5v1.5h-1.5V7.5Zm-3.75 3h2.25v1.5h-2.25v-1.5Zm-3.75 0h1.5v1.5h-1.5v-1.5Zm7.5 0h1.5v1.5h-1.5v-1.5Zm-3.75 3h2.25v1.5h-2.25v-1.5Zm-3.75 0h1.5v1.5h-1.5v-1.5Zm7.5 0h1.5v1.5h-1.5v-1.5Z" />'
  },
  Marketing: {
    viewBox: '0 0 24 24',
    path: '<path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />'
  },
  Science: {
    viewBox: '0 0 24 24',
    path: '<path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.146-.502.319-.75.514A6.003 6.003 0 0 0 5.25 9.75c0 1.578.61 3.017 1.606 4.091l.639.63M9.75 3.104a7.496 7.496 0 0 1 7.5 7.5c0 2.535-1.228 4.78-3.114 6.192M14.25 3.104v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.146.502.319.75.514A6.003 6.003 0 0 1 18.75 9.75c0 1.578-.61 3.017-1.606 4.091l-.639.63M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />'
  },
  Language: {
    viewBox: '0 0 24 24',
    path: '<path d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 0 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />'
  },
  Other: {
    viewBox: '0 0 24 24',
    path: '<path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />'
  }
};

// Level-based color themes (gradient backgrounds)
const levelColors = {
  Beginner: {
    primary: '#10B981',    // Emerald green
    secondary: '#059669',  // Darker green
    bgStart: '#ECFDF5',    // Light green background
    bgEnd: '#D1FAE5'       // Slightly darker green
  },
  Intermediate: {
    primary: '#3B82F6',    // Blue
    secondary: '#2563EB',  // Darker blue
    bgStart: '#EFF6FF',   // Light blue background
    bgEnd: '#DBEAFE'      // Slightly darker blue
  },
  Advanced: {
    primary: '#8B5CF6',    // Purple
    secondary: '#7C3AED',  // Darker purple
    bgStart: '#F5F3FF',    // Light purple background
    bgEnd: '#EDE9FE'      // Slightly darker purple
  }
};

/**
 * Generate SVG thumbnail for a course
 * @param {string} category - Course category
 * @param {string} level - Course level (Beginner, Intermediate, Advanced)
 * @returns {string} SVG data URL
 */
function generateCourseThumbnail(category, level = 'Beginner') {
  // Normalize inputs
  const normalizedCategory = categoryIcons[category] ? category : 'Other';
  const normalizedLevel = levelColors[level] ? level : 'Beginner';
  
  const icon = categoryIcons[normalizedCategory];
  const colors = levelColors[normalizedLevel];
  
  // Generate unique IDs to avoid conflicts when multiple SVGs are on the same page
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  const gradientId = `bg-gradient-${uniqueId}`;
  const shadowId = `shadow-${uniqueId}`;
  const patternId = `pattern-${uniqueId}`;
  
  // Generate SVG with more sophisticated design
  const svg = `
    <svg width="600" height="360" viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Main gradient background -->
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bgStart};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.bgEnd};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.1" />
        </linearGradient>
        
        <!-- Drop shadow filter -->
        <filter id="${shadowId}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="${colors.primary}" flood-opacity="0.2"/>
        </filter>
        
        <!-- Pattern overlay -->
        <pattern id="${patternId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="${colors.primary}" fill-opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Main background -->
      <rect width="600" height="360" fill="url(#${gradientId})" />
      
      <!-- Pattern overlay -->
      <rect width="600" height="360" fill="url(#${patternId})" />
      
      <!-- Large decorative shape -->
      <path d="M500 0 L600 0 L600 100 Q500 50 500 0" fill="${colors.primary}" fill-opacity="0.08" />
      <path d="M0 360 L100 360 Q50 300 0 280 L0 360" fill="${colors.primary}" fill-opacity="0.08" />
      
      <!-- Decorative circles -->
      <circle cx="520" cy="60" r="80" fill="${colors.primary}" fill-opacity="0.06" />
      <circle cx="80" cy="300" r="60" fill="${colors.primary}" fill-opacity="0.06" />
      <circle cx="450" cy="280" r="40" fill="${colors.primary}" fill-opacity="0.04" />
      
      <!-- Central card design -->
      <g transform="translate(50, 40)" filter="url(#${shadowId})">
        <!-- Card background -->
        <rect x="0" y="0" width="500" height="280" rx="16" fill="white" fill-opacity="0.95" />
        
        <!-- Top accent bar -->
        <rect x="0" y="0" width="500" height="8" rx="0" fill="${colors.primary}" />
        <rect x="0" y="8" width="500" height="272" rx="16" fill="white" fill-opacity="0.95" />
        <rect x="0" y="8" width="500" height="16" fill="white" fill-opacity="0.95" />
        
        <!-- Icon circle -->
        <circle cx="250" cy="110" r="60" fill="${colors.primary}" fill-opacity="0.1" />
        <circle cx="250" cy="110" r="45" fill="${colors.primary}" fill-opacity="0.15" />
        
        <!-- Icon -->
        <g transform="translate(217, 77) scale(2.8)" fill="${colors.primary}">
          ${icon.path}
        </g>
        
        <!-- Category label -->
        <rect x="180" y="190" width="140" height="28" rx="14" fill="${colors.primary}" fill-opacity="0.1" />
        <text x="250" y="208" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="${colors.secondary}" text-anchor="middle">
          ${normalizedCategory.toUpperCase()}
        </text>
        
        <!-- Level indicator -->
        <rect x="175" y="225" width="150" height="24" rx="12" fill="${colors.primary}" fill-opacity="0.08" />
        <text x="250" y="241" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="500" fill="${colors.secondary}" text-anchor="middle" letter-spacing="1">
          ${normalizedLevel.toUpperCase()} LEVEL
        </text>
      </g>
      
      <!-- Bottom accent -->
      <rect x="50" y="310" width="500" height="4" rx="2" fill="${colors.primary}" fill-opacity="0.3" />
    </svg>
  `.trim();
  
  // Convert to base64 data URL
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Check if a thumbnail URL is auto-generated
 * @param {string} thumbnailUrl - Thumbnail URL to check
 * @returns {boolean} True if auto-generated
 */
function isAutoGeneratedThumbnail(thumbnailUrl) {
  if (!thumbnailUrl) return false;
  return thumbnailUrl.startsWith('data:image/svg+xml;base64,');
}

/**
 * Get thumbnail URL for a course (auto-generate if needed)
 * @param {string} existingThumbnail - Existing thumbnail URL
 * @param {string} category - Course category
 * @param {string} level - Course level
 * @returns {string} Thumbnail URL to use
 */
function getCourseThumbnail(existingThumbnail, category, level) {
  // If custom thumbnail exists and is not auto-generated, use it
  if (existingThumbnail && !isAutoGeneratedThumbnail(existingThumbnail)) {
    return existingThumbnail;
  }
  
  // Otherwise, generate auto-thumbnail
  return generateCourseThumbnail(category, level);
}

export {
  generateCourseThumbnail,
  isAutoGeneratedThumbnail,
  getCourseThumbnail,
  categoryIcons,
  levelColors
};