import Course from '../models/Course.js';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6LsywfJAV1KoPoJvxuJPwSMCd4P80G1FkBbTb1Fls1qwQ' });

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
    return res.status(500).json({ success: false, message: 'Error communicating with AI assistant' });
  }
};
