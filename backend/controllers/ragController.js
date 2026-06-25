import Course from '../models/Course.js';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini with environment variable
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey && apiKey !== 'your_gemini_key_here' && apiKey !== 'AQ.Ab8RN6LsywfJAV1KoPoJvxuJPwSMCd4P80G1FkBbTb1Fls1qwQ') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn('Failed to initialize Gemini AI:', error.message);
  }
}

export const chatWithRAG = async (req, res) => {
  try {
    const { courseId, message } = req.body;
    
    if (!courseId || !message) {
      return res.status(400).json({ success: false, message: 'Missing courseId or message' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Prepare course context
    let courseContext = `Course Title: ${course.title}\nCategory: ${course.category}\nDescription: ${course.description}\n\n`;
    if (course.lessons && course.lessons.length > 0) {
      courseContext += "Course Lessons / Content:\n";
      course.lessons.forEach((lesson, index) => {
        courseContext += `\nLesson ${index + 1}: ${lesson.title}\nDuration: ${lesson.duration}\nContent: ${lesson.content || 'Video lecture/Reading material'}\n`;
      });
    }

    // If AI is not available, provide a mock response based on course content
    if (!ai) {
      const mockResponse = generateMockResponse(course, courseContext, message);
      return res.status(200).json({ success: true, reply: mockResponse });
    }

    const prompt = `You are a dedicated AI teaching assistant for the course "${course.title}". 
Your primary job is to answer the student's questions based ONLY on the provided course material and syllabus below.

COURSE MATERIAL CONTEXT:
${courseContext}

STUDENT QUESTION:
${message}

INSTRUCTIONS:
1. Provide a helpful, clear, and accurate answer based ON the course material.
2. If the answer cannot be found in the course material, politely inform the user that you can only provide information related to this specific course's content.
3. Keep the response formatted in Markdown for readability.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ success: true, reply: response.text });
  } catch (error) {
    console.error('RAG Error:', error);
    // Fallback to mock response on error
    const course = await Course.findById(req.body.courseId);
    if (course) {
      const mockResponse = generateMockResponse(course, '', req.body.message);
      return res.status(200).json({ success: true, reply: mockResponse });
    }
    return res.status(500).json({ success: false, message: 'Error communicating with AI assistant' });
  }
};

// Generate a mock response based on course content when AI is unavailable
function generateMockResponse(course, courseContext, message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('about') || lowerMessage.includes('overview') || lowerMessage.includes('summary')) {
    return `# About this Course\n\n**${course.title}**\n\n**Category:** ${course.category}\n\n**Description:** ${course.description}\n\nThis course covers the following topics:\n${course.lessons && course.lessons.length > 0 ? course.lessons.map((l, i) => `${i + 1}. ${l.title} (${l.duration})`).join('\n') : 'Various topics related to the course subject.'}\n\nIs there anything specific about this course you'd like to know more about?`;
  }
  
  if (lowerMessage.includes('lesson') || lowerMessage.includes('content') || lowerMessage.includes('topic')) {
    if (course.lessons && course.lessons.length > 0) {
      return `# Course Content\n\nThis course includes ${course.lessons.length} lessons:\n\n${course.lessons.map((l, i) => `**Lesson ${i + 1}: ${l.title}**\n- Duration: ${l.duration}\n- ${l.content || 'Video lecture and reading materials'}\n`).join('\n')}\n\nWould you like more details about any specific lesson?`;
    }
    return `# Course Content\n\nThis course covers various topics in ${course.category}. Check the course syllabus for detailed lesson information.`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
    return `# How can I help you?\n\nI'm your AI teaching assistant for **${course.title}**. I can help you with:\n\n- Understanding course concepts\n- Explaining lesson content\n- Providing overviews of topics\n- Answering questions about the course material\n\nWhat would you like to know about this course?`;
  }
  
  // Default response
  return `# Course Information\n\nBased on your question about "${message}", here's what I can tell you about **${course.title}**:\n\n**Category:** ${course.category}\n\n**Description:** ${course.description}\n\n${course.lessons && course.lessons.length > 0 ? `This course has ${course.lessons.length} lessons covering various aspects of the subject. For more specific information about lessons or topics, please ask about the course content or syllabus.` : 'For more detailed information, please ask about specific aspects of the course.'}\n\nIs there anything specific you'd like to learn about this course?`;
}
