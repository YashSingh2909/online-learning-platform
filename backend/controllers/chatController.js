import Message from '../models/Message.js';

export const getCourseMessages = async (req, res) => {
  try {
    const { courseId } = req.params;

    console.log('[chatController] getCourseMessages courseId:', courseId);

    const messages = await Message.find({ course: courseId })
      .populate('sender', 'name profileImage')
      .sort({ timestamp: 1 });

    console.log('[chatController] getCourseMessages count:', messages?.length, 'firstId:', messages?.[0]?._id);

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('[chatController] getCourseMessages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
