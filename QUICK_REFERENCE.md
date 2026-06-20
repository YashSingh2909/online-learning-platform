# 🚀 EduSphere - Quick Reference Guide

## ⚡ Quick Commands

### Backend Quick Start
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend Quick Start
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍🎓 Student | john@example.com | password123 |
| 👨‍🏫 Instructor | alice@example.com | password123 |
| 👨‍💼 Admin | admin@example.com | password123 |

---

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 📚 API Quick Test

### Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Courses
```bash
curl http://localhost:5000/api/courses
```

### Get Current User (Replace TOKEN)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/auth/me
```

---

## 📂 Key Files

### Backend
- `backend/server.js` - Main server file
- `backend/config/database.js` - MongoDB connection
- `backend/.env` - Environment variables

### Frontend
- `frontend/src/App.jsx` - Main app
- `frontend/src/api/apiService.js` - All API calls
- `frontend/.env` - Environment variables

---

## 🐛 Common Issues & Quick Fixes

### MongoDB Connection Error
```bash
# Start MongoDB
mongod

# OR if using Homebrew on Mac
brew services start mongodb-community
```

### Port Already in Use
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Check FRONTEND_URL in backend `.env`
- Check VITE_API_URL in frontend `.env`
- Make sure backend is running

---

## 📊 Database Collections

```javascript
db.users.find()           // View users
db.courses.find()         // View courses
db.enrollments.find()     // View enrollments
db.quizzes.find()         // View quizzes
db.assignments.find()     // View assignments
db.notifications.find()   // View notifications
db.payments.find()        // View payments
db.progresses.find()      // View progress
```

---

## 🎯 Workflow Quick Guide

### Student Workflow
1. Go to http://localhost:5173
2. Click "Log In"
3. Use: john@example.com / password123
4. Browse courses on dashboard
5. Click "View" on any course
6. Click "Enroll Now" or "Join for Free"
7. View your progress

### Instructor Workflow
1. Login as alice@example.com
2. Click "Create New Course" on dashboard
3. Add course details
4. Add lessons
5. Create quizzes/assignments
6. Publish course
7. View student enrollments

### Admin Workflow
1. Login as admin@example.com
2. Access admin features (view all payments, users, etc.)

---

## 📁 Project Structure at a Glance

```
Backend:                          Frontend:
├── models/ (8 files)            ├── pages/ (4 files)
├── controllers/ (8 files)       ├── api/ (2 files)
├── routes/ (8 files)            ├── context/ (1 file)
├── middleware/ (1 file)         ├── routes/ (1 file)
├── utils/ (2 files)             ├── components/ (expandable)
├── seed/ (1 file)               └── public/ (assets)
└── server.js
```

---

## 🔌 API Endpoints Quick Reference

### Auth
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /auth/me` - Current user

### Courses
- `GET /courses` - List all
- `GET /courses/:id` - Get details
- `POST /courses` - Create (Instructor)

### Enrollments
- `POST /enrollments/enroll` - Enroll
- `GET /enrollments/my-enrollments` - My courses

### Quizzes
- `POST /quizzes/:id/submit` - Submit quiz

### Assignments
- `POST /assignments/:id/submit` - Submit assignment

### Payments
- `POST /payments/create-order` - Create order
- `POST /payments/verify` - Verify payment

### Notifications
- `GET /notifications` - Get all
- `PUT /notifications/:id/read` - Mark read

### Certificates
- `POST /certificates/generate` - Generate

---

## 🎨 Customization Quick Tips

### Change Colors (Tailwind)
Edit `frontend/src/index.css` or use Tailwind classes directly

### Add New Page
1. Create file in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Create ProtectedRoute if needed

### Add New API Endpoint
1. Create controller method in `backend/controllers/`
2. Add route in `backend/routes/`
3. Import route in `backend/server.js`
4. Add API call in `frontend/src/api/apiService.js`

---

## 📦 Dependencies Summary

### Backend (11 packages)
- express, mongoose, bcryptjs, jsonwebtoken
- dotenv, cors, multer, axios
- pdfkit, uuid, nodemon (dev)

### Frontend (5 packages)
- react, react-dom, react-router-dom, axios
- vite, @vitejs/plugin-react (dev)

---

## 🚢 Quick Deployment Checklist

### Before Deploying
- [ ] Change JWT_SECRET in .env
- [ ] Change MONGODB_URI to production DB
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL
- [ ] Review error handling
- [ ] Test all endpoints
- [ ] Check CORS settings

### Deploy Backend (Heroku)
```bash
cd backend
heroku create edusphere-backend
heroku config:set MONGODB_URI=<uri>
heroku config:set JWT_SECRET=<secret>
git push heroku main
```

### Deploy Frontend (Vercel)
- Push to GitHub
- Connect repo to Vercel
- Set env variables
- Deploy

---

## 🎓 Learning Resources Included

- Full source code with comments
- 4 documentation files
- Sample seed data
- Test credentials
- API examples with cURL
- Error handling examples
- Real-world patterns

---

## ✨ Feature Checklist

### Core Features
- ✅ User authentication (JWT)
- ✅ Role-based access
- ✅ Course management
- ✅ Video lessons
- ✅ Progress tracking
- ✅ Quizzes with auto-grading
- ✅ Assignment submission
- ✅ Payment processing
- ✅ Certificate generation
- ✅ Notifications

### Optional Features (Ready to Add)
- [ ] Real-time chat
- [ ] Live classes
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Discussion forum
- [ ] Gamification

---

## 🆘 Need Help?

1. **Check SETUP_GUIDE.md** for detailed setup
2. **Check API_DOCUMENTATION.md** for API details
3. **Check PROJECT_STRUCTURE.md** for file details
4. **Check error messages** - they're descriptive
5. **Check MongoDB** - is it running?
6. **Check ports** - 5000 and 5173 available?
7. **Check .env files** - are they set correctly?

---

## 💡 Pro Tips

1. **Use MongoDB Compass** to visualize your database
2. **Use Postman** to test APIs before frontend
3. **Use browser DevTools** to debug frontend (F12)
4. **Use `npm run dev`** for hot reload during development
5. **Keep .env files secure** - never commit them
6. **Test with all roles** - Student, Instructor, Admin
7. **Check browser console** for frontend errors
8. **Check terminal** for backend errors

---

## 🎯 Common Tasks

### View Database
```bash
mongosh
use edusphere
db.users.find()
```

### Reset Database
```bash
cd backend
npm run seed
```

### Check API Status
```bash
curl http://localhost:5000/api/health
```

### View Logs
```bash
# Backend logs - visible in terminal
npm run dev

# Frontend logs - F12 in browser console
```

---

## 🔄 Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: EduSphere platform"

# Daily work
git add .
git commit -m "Description of changes"
git push origin main

# Create feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Create PR and merge when ready
```

---

## 📋 File Checklist

### Must Have
- ✅ backend/.env
- ✅ frontend/.env
- ✅ MongoDB running
- ✅ Node.js installed

### Nice to Have
- ✅ MongoDB Compass
- ✅ Postman
- ✅ Git
- ✅ VS Code

---

**Ready to launch? Start with:**
```bash
cd backend && npm run dev
# In another terminal:
cd frontend && npm run dev
```

Then visit: http://localhost:5173 🚀

---

*Last updated: 2024*
*For latest documentation, check README.md and other .md files*
