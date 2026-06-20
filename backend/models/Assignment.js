import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dueDate: Date,
  deadline: Date,
  totalPoints: {
    type: Number,
    default: 100,
  },
  maxScore: {
    type: Number,
    default: 100,
  },
  // Uploaded resources to attach to the assignment (pdf/zip/image/etc)
  resourceUrls: [{ type: String }],
  // If true, students can preview the assignment without enrollment.
  isFreePreview: { type: Boolean, default: false },
  // If false, assignment is not available to students.
  isPublished: { type: Boolean, default: true },
  submissions: [

    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      submittedAt: Date,
      fileUrl: String,
      status: {
        type: String,
        enum: ['submitted', 'graded'],
        default: 'submitted',
      },
      score: Number,
      feedback: String,
      gradedAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Assignment', assignmentSchema);
