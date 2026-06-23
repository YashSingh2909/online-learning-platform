import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      unique: true,
      index: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    courseTitle: {
      type: String,
      required: true,
    },

    completionDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['generated'],
      default: 'generated',
    },
  },
  { timestamps: true }
);

/**
 * 🔥 IMPORTANT FIX:
 * Always normalize enrollmentId before saving/query issues
 */
certificateSchema.pre('save', function (next) {
  if (this.enrollmentId && typeof this.enrollmentId === 'string') {
    this.enrollmentId = new mongoose.Types.ObjectId(this.enrollmentId);
  }
  next();
});

export default mongoose.model('Certificate', certificateSchema);