import Discussion from '../models/Discussion.js';
import DiscussionReply from '../models/DiscussionReply.js';

export const getDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const discussions = await Discussion.find({ course: courseId })
      .populate('author', 'name profileImage role')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: discussions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    
    const discussion = await Discussion.create({
      course: courseId,
      author: req.user.id,
      title,
      content
    });
    
    await discussion.populate('author', 'name profileImage role');
    
    res.status(201).json({ success: true, data: discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDiscussionReplies = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const replies = await DiscussionReply.find({ discussion: discussionId })
      .populate('author', 'name profileImage role')
      .sort({ createdAt: 1 });
      
    res.status(200).json({ success: true, data: replies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;
    
    const reply = await DiscussionReply.create({
      discussion: discussionId,
      author: req.user.id,
      content
    });
    
    await reply.populate('author', 'name profileImage role');
    
    res.status(201).json({ success: true, data: reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
