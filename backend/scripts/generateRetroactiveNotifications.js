import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Import all models to ensure schemas are registered
import '../models/User.js';
import '../models/Notification.js';
import '../models/Enrollment.js';
import '../models/Assignment.js';
import '../models/Course.js';

// Get the models after they're registered
const Notification = mongoose.model('Notification');
const Enrollment = mongoose.model('Enrollment');
const Assignment = mongoose.model('Assignment');
const Course = mongoose.model('Course');

dotenv.config();

const generateRetroactiveNotifications = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let totalCreated = 0;

    // 1. Generate notifications for existing enrollments
    console.log('\n📚 Processing enrollments...');
    const enrollments = await Enrollment.find()
      .populate('student')
      .populate('course', 'title');

    for (const enrollment of enrollments) {
      // Skip if student or course is missing
      if (!enrollment.student || !enrollment.course) {
        console.log(`⚠ Skipping enrollment with missing student or course`);
        continue;
      }

      // Check if notification already exists for this enrollment
      const existingNotification = await Notification.findOne({
        recipient: enrollment.student._id,
        type: 'enrollment',
        relatedCourse: enrollment.course._id,
      });

      if (!existingNotification) {
        await Notification.create({
          recipient: enrollment.student._id,
          title: 'Course Enrollment Successful',
          message: `You have successfully enrolled in ${enrollment.course.title}`,
          type: 'enrollment',
          relatedCourse: enrollment.course._id,
          read: true, // Mark as read since it's historical
          createdAt: enrollment.enrolledAt || new Date(),
        });
        totalCreated++;
        console.log(`✓ Created enrollment notification for user ${enrollment.student._id} - ${enrollment.course.title}`);
      }
    }

    // 2. Generate notifications for graded assignments
    console.log('\n📝 Processing graded assignments...');
    const assignments = await Assignment.find()
      .populate('course', 'title')
      .populate('submissions.student');

    for (const assignment of assignments) {
      if (!assignment.submissions || assignment.submissions.length === 0) continue;

      for (const submission of assignment.submissions) {
        // Skip if student or assignment is missing
        if (!submission.student || !assignment.course) {
          console.log(`⚠ Skipping submission with missing student or course`);
          continue;
        }

        if (submission.status === 'graded' && submission.score !== undefined) {
          // Check if notification already exists for this graded submission
          const existingNotification = await Notification.findOne({
            recipient: submission.student._id,
            type: 'grade',
            relatedAssignment: assignment._id,
          });

          if (!existingNotification) {
            await Notification.create({
              recipient: submission.student._id,
              title: 'Assignment Graded',
              message: `Your assignment "${assignment.title}" has been graded. Score: ${submission.score}/${assignment.totalPoints}`,
              type: 'grade',
              relatedAssignment: assignment._id,
              relatedCourse: assignment.course._id,
              read: true, // Mark as read since it's historical
              createdAt: submission.gradedAt || new Date(),
            });
            totalCreated++;
            console.log(`✓ Created grade notification for user ${submission.student._id} - ${assignment.title}`);
          }
        }
      }
    }

    console.log(`\n✅ Retroactive notification generation complete!`);
    console.log(`📊 Total notifications created: ${totalCreated}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating retroactive notifications:', error);
    process.exit(1);
  }
};

generateRetroactiveNotifications();