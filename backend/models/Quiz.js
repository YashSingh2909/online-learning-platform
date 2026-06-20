import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  questions: [
    {
      questionText: String,
      question: String,
      questionType: {
        type: String,
        enum: ['mcq', 'true-false'],
      },
      options: [String],
      correctAnswer: String,
      explanation: String,
    },
  ],
  totalPoints: {
    type: Number,
    default: 0,
  },
  passingScore: {
    type: Number,
    default: 60,
  },
  timeLimit: {
    type: Number,
    default: 0,
  },
  // If true, students can view this quiz without enrollment.
  isFreePreview: { type: Boolean, default: false },
  // If false, quiz is not available to students.
  isPublished: { type: Boolean, default: true },

  attempts: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      score: Number,
      answers: [String],
      attemptedAt: Date,
      timeTaken: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Quiz', quizSchema);
