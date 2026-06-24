import Message from '../models/Message.js';

export const getCourseMessages = async (req, res) => {
  try {
    const { courseId } = req.params;
    const messages = await Message.find({ course: courseId })
      .populate('sender', 'name profileImage')
      .sort({ timestamp: 1 }); // Oldest first for chat history
      
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
