import mongoose from 'mongoose';
import Assignment from './models/Assignment.js';
import dotenv from 'dotenv';

dotenv.config();

const fixAssignmentPoints = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-learning-platform');
    console.log('Connected to MongoDB');

    // Update the specific assignment
    const assignmentId = '6a3d03b2637e64303155272c';
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      console.log('Assignment not found');
      return;
    }

    console.log('Current assignment data:', {
      title: assignment.title,
      totalPoints: assignment.totalPoints,
      maxScore: assignment.maxScore
    });

    // Update to 20 points
    assignment.totalPoints = 20;
    assignment.maxScore = 20;
    
    await assignment.save();
    
    console.log('Updated assignment data:', {
      title: assignment.title,
      totalPoints: assignment.totalPoints,
      maxScore: assignment.maxScore
    });

    console.log('Assignment updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixAssignmentPoints();