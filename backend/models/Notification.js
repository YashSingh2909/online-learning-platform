import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['course-update', 'assignment-deadline', 'enrollment', 'payment', 'grade', 'general'],
    default: 'general',
  },
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  relatedAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Notification', notificationSchema);
