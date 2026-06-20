import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedLessons: [
    {
      lessonId: Number,
      completedAt: Date,
      watchTime: Number,
    },
  ],
  lastAccessedAt: Date,
  totalWatchTime: {
    type: Number,
    default: 0,
  },
  completionPercentage: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Progress', progressSchema);
