import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import Assignment from '../models/Assignment.js';

export const seedDemoData = async () => {
  // Always ensure admin exists with properly hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
    { upsert: true, new: true }
  );

  const userCount = await User.countDocuments();
  if (userCount > 1) {
    return;
  }

  const students = await User.create([
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'student',
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'password123',
      role: 'student',
    },
  ]);

  const instructors = await User.create([
    {
      name: 'Prof. Alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'instructor',
    },
    {
      name: 'Prof. Charlie',
      email: 'charlie@example.com',
      password: 'password123',
      role: 'instructor',
    },
  ]);

  const admin = await User.findOne({ email: 'admin@example.com' });

  const courses = await Course.create([
    {
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      category: 'Programming',
      instructor: instructors[0]._id,
      price: 4999,
      thumbnail: 'https://via.placeholder.com/300x200?text=Web+Dev',
      duration: '40 hours',
      rating: 4.5,
      students: 150,
      lessons: [
        {
          title: 'HTML Basics',
          description: 'Learn HTML fundamentals',
          videoUrl: 'https://example.com/video1.mp4',
          duration: '2 hours',
          order: 1,
        },
        {
          title: 'CSS Styling',
          description: 'Master CSS styling techniques',
          videoUrl: 'https://example.com/video2.mp4',
          duration: '3 hours',
          order: 2,
        },
        {
          title: 'JavaScript Fundamentals',
          description: 'Learn JavaScript basics',
          videoUrl: 'https://example.com/video3.mp4',
          duration: '5 hours',
          order: 3,
        },
      ],
      isPublished: true,
    },
    {
      title: 'React.js Mastery',
      description: 'Master React.js for building modern web applications',
      category: 'Programming',
      instructor: instructors[0]._id,
      price: 5999,
      thumbnail: 'https://via.placeholder.com/300x200?text=React',
      duration: '50 hours',
      rating: 4.8,
      students: 200,
      lessons: [
        {
          title: 'React Basics',
          description: 'Get started with React',
          videoUrl: 'https://example.com/video4.mp4',
          duration: '3 hours',
          order: 1,
        },
        {
          title: 'Hooks and State Management',
          description: 'Master React Hooks',
          videoUrl: 'https://example.com/video5.mp4',
          duration: '4 hours',
          order: 2,
        },
      ],
      isPublished: true,
    },
    {
      title: 'UI/UX Design Principles',
      description: 'Learn modern UI/UX design principles and best practices',
      category: 'Design',
      instructor: instructors[1]._id,
      price: 3999,
      thumbnail: 'https://via.placeholder.com/300x200?text=Design',
      duration: '30 hours',
      rating: 4.6,
      students: 120,
      lessons: [
        {
          title: 'Design Fundamentals',
          description: 'Learn design principles',
          videoUrl: 'https://example.com/video6.mp4',
          duration: '2 hours',
          order: 1,
        },
      ],
      isPublished: true,
    },
    {
      title: 'Business Strategy 101',
      description: 'Master business strategy and entrepreneurship',
      category: 'Business',
      instructor: instructors[1]._id,
      price: 2999,
      thumbnail: 'https://via.placeholder.com/300x200?text=Business',
      duration: '25 hours',
      rating: 4.4,
      students: 85,
      lessons: [
        {
          title: 'Business Basics',
          description: 'Introduction to business',
          videoUrl: 'https://example.com/video7.mp4',
          duration: '2 hours',
          order: 1,
        },
      ],
      isPublished: true,
    },
  ]);

  await User.findByIdAndUpdate(instructors[0]._id, {
    createdCourses: [courses[0]._id, courses[1]._id],
  });

  await User.findByIdAndUpdate(instructors[1]._id, {
    createdCourses: [courses[2]._id, courses[3]._id],
  });

  await Quiz.create({
    title: 'HTML Basics Quiz',
    course: courses[0]._id,
    questions: [
      {
        questionText: 'What does HTML stand for?',
        questionType: 'mcq',
        options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
        correctAnswer: 'HyperText Markup Language',
        explanation: 'HTML stands for HyperText Markup Language',
      },
      {
        questionText: 'HTML is used for data formatting and displaying data.',
        questionType: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'HTML is used to markup content and display it in browsers',
      },
    ],
    totalPoints: 100,
    passingScore: 60,
  });

  await Assignment.create({
    title: 'Build a Simple Website',
    description: 'Create a simple HTML/CSS website with multiple pages',
    course: courses[0]._id,
    instructor: instructors[0]._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    totalPoints: 100,
  });
};
