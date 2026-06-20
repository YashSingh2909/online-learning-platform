# EduSphere - Online Learning Management System 🎓

A complete full-stack online learning platform built with the MERN stack (MongoDB, Express, React, Node.js).

## 🎯 Features

### Student Features
- ✅ User authentication and profile management
- ✅ Browse and search courses
- ✅ Enroll in courses
- ✅ Watch video lectures
- ✅ Track learning progress
- ✅ Complete quizzes
- ✅ Submit assignments
- ✅ Join course discussions
- ✅ Receive notifications
- ✅ Generate certificates on completion

### Instructor Features
- ✅ Create and manage courses
- ✅ Upload video content
- ✅ Create quizzes and assignments
- ✅ View student progress
- ✅ Grade submissions
- ✅ Manage course enrollments
- ✅ View course analytics

### Admin Features
- ✅ Manage all users and roles
- ✅ Manage courses and content
- ✅ View payment history
- ✅ Platform analytics dashboard

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **PDFKit** for certificate generation
- **Razorpay** (optional - payments)

## 📁 Project Structure

```
edusphere/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Progress.js
│   │   ├── Quiz.js
│   │   ├── Assignment.js
│   │   ├── Notification.js
│   │   └── Payment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── quizController.js
│   │   ├── assignmentController.js
│   │   ├── paymentController.js
│   │   ├── notificationController.js
│   │   └── certificateController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── certificateRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── tokenUtils.js
│   │   └── certificateUtils.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── CourseDetail.jsx
│   │   ├── api/
│   │   │   ├── axiosConfig.js
│   │   │   └── apiService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your credentials**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/edusphere
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:5173
   ```

5. **Seed the database** (optional - adds sample data)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

App will open at `http://localhost:5173`

## 🧪 Test Credentials

After running seed data:

| Role | Email | Password |
|------|-------|----------|
| Student | john@example.com | password123 |
| Instructor | alice@example.com | password123 |
| Admin | admin@example.com | password123 |

## 📚 API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Body: { name, email, password, role }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Courses

#### Get All Courses
```
GET /api/courses?category=&search=
```

#### Get Course by ID
```
GET /api/courses/:id
```

#### Create Course (Instructor)
```
POST /api/courses
Headers: Authorization: Bearer <token>
Body: { title, description, category, price, thumbnail }
```

#### Update Course (Instructor)
```
PUT /api/courses/:id
Headers: Authorization: Bearer <token>
Body: { title, description, ... }
```

#### Delete Course (Instructor)
```
DELETE /api/courses/:id
Headers: Authorization: Bearer <token>
```

#### Add Lesson to Course
```
POST /api/courses/:id/lessons
Headers: Authorization: Bearer <token>
Body: { title, description, videoUrl, duration }
```

#### Publish Course
```
PUT /api/courses/:id/publish
Headers: Authorization: Bearer <token>
```

### Enrollments

#### Enroll in Course
```
POST /api/enrollments/enroll
Headers: Authorization: Bearer <token>
Body: { courseId }
```

#### Get My Enrollments
```
GET /api/enrollments/my-enrollments
Headers: Authorization: Bearer <token>
```

#### Get Enrollment by Course
```
GET /api/enrollments/:courseId
Headers: Authorization: Bearer <token>
```

#### Complete Lesson
```
PUT /api/enrollments/complete-lesson
Headers: Authorization: Bearer <token>
Body: { courseId, lessonId }
```

### Quizzes

#### Get Quizzes for Course
```
GET /api/quizzes/course/:courseId
Headers: Authorization: Bearer <token>
```

#### Get Quiz by ID
```
GET /api/quizzes/:quizId
Headers: Authorization: Bearer <token>
```

#### Submit Quiz
```
POST /api/quizzes/:quizId/submit
Headers: Authorization: Bearer <token>
Body: { answers, timeTaken }
```

### Assignments

#### Get Assignments
```
GET /api/assignments/course/:courseId
Headers: Authorization: Bearer <token>
```

#### Submit Assignment
```
POST /api/assignments/:id/submit
Headers: Authorization: Bearer <token>
Body: { fileUrl }
```

#### Grade Submission (Instructor)
```
PUT /api/assignments/:id/grade
Headers: Authorization: Bearer <token>
Body: { submissionId, score, feedback }
```

### Payments

#### Create Payment Order
```
POST /api/payments/create-order
Headers: Authorization: Bearer <token>
Body: { courseId }
```

#### Verify Payment
```
POST /api/payments/verify
Headers: Authorization: Bearer <token>
Body: { orderId, razorpayPaymentId, razorpaySignature }
```

#### Get Payment History
```
GET /api/payments/history
Headers: Authorization: Bearer <token>
```

### Notifications

#### Get Notifications
```
GET /api/notifications
Headers: Authorization: Bearer <token>
```

#### Mark as Read
```
PUT /api/notifications/:id/read
Headers: Authorization: Bearer <token>
```

### Certificates

#### Generate Certificate
```
POST /api/certificates/generate
Headers: Authorization: Bearer <token>
Body: { enrollmentId }
```

#### Get Certificate Status
```
GET /api/certificates/status/:courseId
Headers: Authorization: Bearer <token>
```

## 🛡️ Security Features

- ✅ JWT Authentication with Access & Refresh Tokens
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and API endpoints
- ✅ CORS configuration
- ✅ Input validation

## 🚢 Deployment Guide

### Backend Deployment (Heroku)

1. **Install Heroku CLI** and login
2. **Create Heroku app**
   ```bash
   heroku create edusphere-backend
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=<your_mongodb_atlas_uri>
   heroku config:set JWT_SECRET=<your_secret>
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
2. **Connect repository to Vercel**
3. **Add environment variables**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
4. **Deploy**

## 📝 Sample Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'instructor' | 'admin',
  profileImage: String,
  bio: String,
  enrolledCourses: [Course._id],
  createdCourses: [Course._id],
  notifications: [Notification._id]
}
```

### Course
```javascript
{
  title: String,
  description: String,
  category: String,
  instructor: User._id,
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
  isPublished: Boolean
}
```

## 🎯 Future Enhancements

- [ ] Discussion forum with real-time chat
- [ ] Advanced video player with playback speed and subtitles
- [ ] AI-powered personalized recommendations
- [ ] Video conferencing for live classes
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Social learning features
- [ ] Gamification (badges, leaderboards)
- [ ] Multi-language support
- [ ] Advanced payment integration

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for education

---

**Happy Learning! 🚀**
