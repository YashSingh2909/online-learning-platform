import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Science', 'Language', 'Other'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/300x200',
  },
  duration: {
    type: String,
    default: '0 hours',
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  students: {
    type: Number,
    default: 0,
  },
  lessons: [
    {
      title: String,
      description: String,
      videoUrl: String,
      duration: String,
      // Ordering within module/section
      order: { type: Number, default: 0 },
      module: { type: String, default: 'Module 1' },
      // If true, students can preview this lesson without enrollment.
      isFreePreview: { type: Boolean, default: false },

    },
  ],

  isPublished: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Course', courseSchema);
