# Backend API Documentation - EduSphere

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "instructor"
}

Response (201):
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "64f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

### 3. Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "64f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "enrolledCourses": [{ ... }],
    "notifications": [{ ... }]
  }
}
```

### 4. Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📚 Course Endpoints

### 1. Get All Courses
```
GET /courses?category=Programming&search=React

Query Parameters:
  - category: String (optional)
  - search: String (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "title": "React Mastery",
      "description": "Learn React...",
      "category": "Programming",
      "price": 5999,
      "rating": 4.8,
      "students": 200,
      "instructor": { ... }
    }
  ]
}
```

### 2. Get Course by ID
```
GET /courses/:id

Response (200):
{
  "success": true,
  "data": {
    "_id": "64f...",
    "title": "React Mastery",
    "description": "...",
    "lessons": [
      {
        "title": "React Basics",
        "videoUrl": "...",
        "duration": "3 hours",
        "order": 1
      }
    ],
    "instructor": { ... }
  }
}
```

### 3. Create Course (Instructor Only)
```
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Course",
  "description": "Course description",
  "category": "Programming",
  "price": 4999,
  "thumbnail": "https://...",
  "duration": "40 hours",
  "lessons": []
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

### 4. Update Course (Instructor Only)
```
PUT /courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 5999,
  ...
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 5. Delete Course (Instructor Only)
```
DELETE /courses/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### 6. Add Lesson to Course (Instructor Only)
```
POST /courses/:id/lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "HTML Basics",
  "description": "Learn HTML fundamentals",
  "videoUrl": "https://example.com/video.mp4",
  "duration": "2 hours"
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

### 7. Publish Course (Instructor Only)
```
PUT /courses/:id/publish
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { ... }
}
```

---

## 📋 Enrollment Endpoints

### 1. Enroll in Course
```
POST /enrollments/enroll
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "64f..."
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "64f...",
    "student": "64f...",
    "course": "64f...",
    "progress": 0,
    "status": "active"
  }
}
```

### 2. Get My Enrollments
```
GET /enrollments/my-enrollments
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "course": { ... },
      "progress": 50,
      "status": "active"
    }
  ]
}
```

### 3. Get Enrollment by Course
```
GET /enrollments/:courseId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "64f...",
    "progress": 50,
    "completedLessons": [0, 1, 2],
    "status": "active"
  }
}
```

### 4. Complete Lesson
```
PUT /enrollments/complete-lesson
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "64f...",
  "lessonId": 0
}

Response (200):
{
  "success": true,
  "data": {
    "progress": 33,
    "completedLessons": [0]
  }
}
```

### 5. Get Course Enrollments (Instructor Only)
```
GET /enrollments/course/:courseId/students
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "student": { name, email, profileImage },
      "progress": 75,
      "status": "active"
    }
  ]
}
```

---

## 🧠 Quiz Endpoints

### 1. Get Quizzes for Course
```
GET /quizzes/course/:courseId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "title": "HTML Basics Quiz",
      "totalPoints": 100,
      "passingScore": 60
    }
  ]
}
```

### 2. Get Quiz by ID
```
GET /quizzes/:quizId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "64f...",
    "title": "HTML Basics Quiz",
    "questions": [
      {
        "questionText": "What does HTML stand for?",
        "questionType": "mcq",
        "options": ["HyperText Markup Language", ...],
        "correctAnswer": "HyperText Markup Language"
      }
    ]
  }
}
```

### 3. Create Quiz (Instructor Only)
```
POST /quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "HTML Quiz",
  "courseId": "64f...",
  "questions": [
    {
      "questionText": "What does HTML stand for?",
      "questionType": "mcq",
      "options": ["Option 1", "Option 2"],
      "correctAnswer": "Option 1"
    }
  ],
  "totalPoints": 100,
  "passingScore": 60,
  "timeLimit": 30
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

### 4. Submit Quiz
```
POST /quizzes/:quizId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": ["Option 1", "Option 2", ...],
  "timeTaken": 25
}

Response (200):
{
  "success": true,
  "data": {
    "score": 80,
    "totalPoints": 100,
    "isPassed": true,
    "passingScore": 60
  }
}
```

### 5. Get Quiz Attempts
```
GET /quizzes/:quizId/attempts
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "score": 80,
      "attemptedAt": "2024-01-15T10:30:00Z",
      "timeTaken": 25
    }
  ]
}
```

---

## ✍️ Assignment Endpoints

### 1. Get Assignments for Course
```
GET /assignments/course/:courseId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "title": "Build a Website",
      "description": "...",
      "dueDate": "2024-01-20",
      "totalPoints": 100
    }
  ]
}
```

### 2. Get Assignment by ID
```
GET /assignments/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 3. Create Assignment (Instructor Only)
```
POST /assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build a Website",
  "description": "Create a simple website...",
  "courseId": "64f...",
  "dueDate": "2024-01-20",
  "totalPoints": 100
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

### 4. Submit Assignment
```
POST /assignments/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "fileUrl": "https://example.com/submission.pdf"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 5. Grade Submission (Instructor Only)
```
PUT /assignments/:id/grade
Authorization: Bearer <token>
Content-Type: application/json

{
  "submissionId": "64f...",
  "score": 95,
  "feedback": "Great work!"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

---

## 💳 Payment Endpoints

### 1. Create Payment Order
```
POST /payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "64f..."
}

Response (201):
{
  "success": true,
  "data": {
    "orderId": "64f...",
    "amount": 5999,
    "currency": "INR",
    "courseName": "React Mastery"
  }
}
```

### 2. Verify Payment
```
POST /payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "64f...",
  "razorpayPaymentId": "pay_...",
  "razorpaySignature": "..."
}

Response (200):
{
  "success": true,
  "message": "Payment verified successfully",
  "data": { ... }
}
```

### 3. Get Payment History
```
GET /payments/history
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "course": { title, price },
      "amount": 5999,
      "status": "success",
      "paidAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 4. Get All Payments (Admin Only)
```
GET /payments
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ ... ]
}
```

---

## 🔔 Notification Endpoints

### 1. Get Notifications
```
GET /notifications
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "64f...",
      "title": "Assignment Graded",
      "message": "Your assignment has been graded. Score: 95/100",
      "type": "grade",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Mark as Read
```
PUT /notifications/:id/read
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { ... }
}
```

### 3. Mark All as Read
```
PUT /notifications/mark-all/read
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 4. Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Notification deleted"
}
```

### 5. Get Unread Count
```
GET /notifications/unread-count
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

## 🎓 Certificate Endpoints

### 1. Generate Certificate
```
POST /certificates/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "enrollmentId": "64f..."
}

Response (200):
  [PDF file download]
```

### 2. Get Certificate Status
```
GET /certificates/status/:courseId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "courseId": "64f...",
    "progress": 100,
    "isCompleted": true,
    "certificateReceived": true,
    "certificateDate": "2024-01-15T10:30:00Z"
  }
}
```

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Courses
```bash
curl http://localhost:5000/api/courses
```

### Get Current User (Authenticated)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/me
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Pagination is not implemented in this version
- File uploads should be handled via CDN or cloud storage
- Implement proper error handling and validation on the client side
