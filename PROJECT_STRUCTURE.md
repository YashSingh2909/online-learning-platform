# EduSphere - Project Structure Summary

## 📁 Complete File Structure

```
online learning platform/
│
├── backend/
│   ├── config/
│   │   └── database.js                  # MongoDB connection config
│   │
│   ├── models/
│   │   ├── User.js                      # User schema (Student/Instructor/Admin)
│   │   ├── Course.js                    # Course schema with lessons
│   │   ├── Enrollment.js                # Student course enrollment
│   │   ├── Progress.js                  # Learning progress tracking
│   │   ├── Quiz.js                      # Quiz and attempts
│   │   ├── Assignment.js                # Assignment and submissions
│   │   ├── Notification.js              # User notifications
│   │   └── Payment.js                   # Payment records
│   │
│   ├── controllers/
│   │   ├── authController.js            # Auth logic (register, login, logout)
│   │   ├── courseController.js          # Course CRUD and management
│   │   ├── enrollmentController.js      # Enrollment logic
│   │   ├── quizController.js            # Quiz creation and submission
│   │   ├── assignmentController.js      # Assignment and grading
│   │   ├── paymentController.js         # Payment processing
│   │   ├── notificationController.js    # Notification management
│   │   └── certificateController.js     # Certificate generation
│   │
│   ├── routes/
│   │   ├── authRoutes.js                # Auth endpoints
│   │   ├── courseRoutes.js              # Course endpoints
│   │   ├── enrollmentRoutes.js          # Enrollment endpoints
│   │   ├── quizRoutes.js                # Quiz endpoints
│   │   ├── assignmentRoutes.js          # Assignment endpoints
│   │   ├── paymentRoutes.js             # Payment endpoints
│   │   ├── notificationRoutes.js        # Notification endpoints
│   │   └── certificateRoutes.js         # Certificate endpoints
│   │
│   ├── middleware/
│   │   └── auth.js                      # JWT auth and role middleware
│   │
│   ├── utils/
│   │   ├── tokenUtils.js                # JWT token generation
│   │   └── certificateUtils.js          # PDF certificate generation
│   │
│   ├── seed/
│   │   └── seedData.js                  # Sample data for testing
│   │
│   ├── server.js                        # Main Express server
│   ├── package.json                     # Backend dependencies
│   ├── .env.example                     # Environment variables template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   # (Additional components can be added here)
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Login page
│   │   │   ├── Register.jsx             # Registration page
│   │   │   ├── Dashboard.jsx            # Main dashboard with courses
│   │   │   └── CourseDetail.jsx         # Course detail and enrollment
│   │   │
│   │   ├── api/
│   │   │   ├── axiosConfig.js           # Axios instance with interceptors
│   │   │   └── apiService.js            # All API calls
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Auth state management
│   │   │
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx       # Route protection logic
│   │   │
│   │   ├── utils/
│   │   │   # (Utility functions can be added here)
│   │   │
│   │   ├── App.jsx                      # Main app component
│   │   ├── main.jsx                     # React entry point
│   │   └── index.css                    # Global styles with Tailwind
│   │
│   ├── public/
│   │   # (Static assets)
│   │
│   ├── index.html                       # HTML template
│   ├── vite.config.js                   # Vite configuration
│   ├── tsconfig.json                    # TypeScript config
│   ├── package.json                     # Frontend dependencies
│   ├── .env.example                     # Environment variables template
│   └── .gitignore
│
├── README.md                            # Main project documentation
├── API_DOCUMENTATION.md                 # Complete API reference
├── SETUP_GUIDE.md                       # Installation and setup instructions
└── .gitignore                          # Git ignore file
```

## 🗄️ Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'instructor' | 'admin',
  profileImage: String,
  bio: String,
  createdAt: Date,
  enrolledCourses: [ObjectId],
  createdCourses: [ObjectId],
  notifications: [ObjectId]
}
```

### Course Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  instructor: ObjectId (User),
  price: Number,
  thumbnail: String,
  duration: String,
  rating: Number,
  students: Number,
  lessons: [{
    title: String,
    description: String,
    videoUrl: String,
    duration: String,
    order: Number
  }],
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Model
```javascript
{
  _id: ObjectId,
  student: ObjectId (User),
  course: ObjectId (Course),
  enrolledAt: Date,
  status: 'active' | 'completed' | 'dropped',
  progress: Number (0-100),
  completedLessons: [Number],
  certificateReceived: Boolean,
  certificateDate: Date
}
```

### Progress Model
```javascript
{
  _id: ObjectId,
  student: ObjectId (User),
  course: ObjectId (Course),
  completedLessons: [{
    lessonId: Number,
    completedAt: Date,
    watchTime: Number
  }],
  lastAccessedAt: Date,
  totalWatchTime: Number,
  completionPercentage: Number
}
```

### Quiz Model
```javascript
{
  _id: ObjectId,
  title: String,
  course: ObjectId (Course),
  questions: [{
    questionText: String,
    questionType: 'mcq' | 'true-false',
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  totalPoints: Number,
  passingScore: Number,
  timeLimit: Number,
  attempts: [{
    student: ObjectId (User),
    score: Number,
    answers: [String],
    attemptedAt: Date,
    timeTaken: Number
  }],
  createdAt: Date
}
```

### Assignment Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  course: ObjectId (Course),
  instructor: ObjectId (User),
  dueDate: Date,
  totalPoints: Number,
  submissions: [{
    student: ObjectId (User),
    submittedAt: Date,
    fileUrl: String,
    status: 'submitted' | 'graded',
    score: Number,
    feedback: String,
    gradedAt: Date
  }],
  createdAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (User),
  title: String,
  message: String,
  type: 'course-update' | 'assignment-deadline' | 'enrollment' | 'payment' | 'grade' | 'general',
  relatedCourse: ObjectId (Course),
  relatedAssignment: ObjectId (Assignment),
  read: Boolean,
  createdAt: Date
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  student: ObjectId (User),
  course: ObjectId (Course),
  amount: Number,
  currency: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: 'pending' | 'success' | 'failed',
  paidAt: Date,
  createdAt: Date
}
```

## 🔌 API Endpoints Summary

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Course Routes
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)
- `POST /api/courses/:id/lessons` - Add lesson (Instructor)
- `PUT /api/courses/:id/publish` - Publish course (Instructor)

### Enrollment Routes
- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/my-enrollments` - Get my enrollments
- `GET /api/enrollments/:courseId` - Get enrollment details
- `PUT /api/enrollments/complete-lesson` - Mark lesson complete
- `GET /api/enrollments/course/:courseId/students` - Get course students (Instructor)

### Quiz Routes
- `GET /api/quizzes/course/:courseId` - Get quizzes
- `GET /api/quizzes/:quizId` - Get quiz details
- `POST /api/quizzes` - Create quiz (Instructor)
- `POST /api/quizzes/:quizId/submit` - Submit quiz
- `GET /api/quizzes/:quizId/attempts` - Get quiz attempts

### Assignment Routes
- `GET /api/assignments/course/:courseId` - Get assignments
- `GET /api/assignments/:id` - Get assignment
- `POST /api/assignments` - Create assignment (Instructor)
- `POST /api/assignments/:id/submit` - Submit assignment
- `PUT /api/assignments/:id/grade` - Grade submission (Instructor)

### Payment Routes
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments` - Get all payments (Admin)

### Notification Routes
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all/read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

### Certificate Routes
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/status/:courseId` - Get certificate status

## 👥 User Roles & Permissions

### Student
- Browse and search courses
- Enroll in courses (free or paid)
- Access course content
- Complete lessons
- Take quizzes
- Submit assignments
- View progress
- Generate certificates
- Receive notifications

### Instructor
- Create and edit courses
- Upload video content
- Create quizzes
- Create assignments
- View student enrollments
- Grade assignments
- View course analytics
- Publish courses

### Admin
- View all users
- Manage courses
- View all payments
- Platform analytics
- System administration

## 🔐 Authentication & Security

- JWT tokens with configurable expiration
- Password hashing with bcryptjs (10 salt rounds)
- Role-based access control (RBAC)
- Protected API endpoints
- CORS configuration
- Secure token refresh mechanism

## 📦 Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- PDFKit for certificate generation
- CORS for cross-origin requests
- Dotenv for environment variables

### Frontend
- React 18 with Vite
- React Router DOM for routing
- Axios for HTTP requests
- Context API for state management
- Tailwind CSS for styling
- ES6+ JavaScript

## 🚀 Performance Considerations

- Database indexes on frequently queried fields
- Pagination ready (can be implemented)
- Lazy loading of course content
- JWT token caching
- Optimized image sizes
- Minified CSS with Tailwind
- Tree-shaking with Vite

## 🔄 Workflow Examples

### Student Enrollment Flow
1. Browse courses (GET /courses)
2. View course details (GET /courses/:id)
3. Enroll/Pay for course (POST /enrollments/enroll or /payments/create-order)
4. Access course content
5. Complete lessons (PUT /enrollments/complete-lesson)
6. Take quizzes and submit assignments
7. Get certificate on 100% completion (POST /certificates/generate)

### Instructor Course Creation Flow
1. Create course (POST /courses)
2. Add lessons (POST /courses/:id/lessons)
3. Create quizzes (POST /quizzes)
4. Create assignments (POST /assignments)
5. Publish course (PUT /courses/:id/publish)
6. View enrollments (GET /enrollments/course/:id/students)
7. Grade submissions (PUT /assignments/:id/grade)

---

## 📝 Next Steps for Enhancements

- [ ] Real-time chat/discussion forum
- [ ] Video conferencing for live classes
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Gamification features
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced payment integrations
- [ ] Email notifications
- [ ] Social features (follow, reviews)

---

**Project Complete! 🎉**
