import express from 'express';
import { getDiscussions, createDiscussion, getDiscussionReplies, addReply } from '../controllers/discussionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getDiscussions)
  .post(protect, createDiscussion);

router.route('/:discussionId/replies')
  .get(protect, getDiscussionReplies)
  .post(protect, addReply);

export default router;
