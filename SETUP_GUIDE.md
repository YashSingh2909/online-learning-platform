# EduSphere - Complete Setup & Installation Guide

## 📋 Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Visual Studio Code** (optional but recommended) - [Download](https://code.visualstudio.com/)
- **MongoDB Compass** (optional - GUI for MongoDB) - [Download](https://www.mongodb.com/products/compass)
- **Postman** (optional - for API testing) - [Download](https://www.postman.com/)

---

## 🚀 Complete Setup Instructions

### Step 1: Clone or Download the Project

```bash
# Using Git
git clone <repository-url>
cd online\ learning\ platform

# Or if downloaded as ZIP
unzip online\ learning\ platform.zip
cd online\ learning\ platform
```

### Step 2: Setup MongoDB

#### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Edition**
   - Windows: Follow [official guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   - Windows: MongoDB should start automatically or run: `mongod`
   - Mac/Linux: `brew services start mongodb-community`

3. **Verify Installation**
   ```bash
   mongosh
   > db.version()
   ```

#### Option B: MongoDB Atlas (Cloud - Easier for Deployment)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up and create a free account

2. **Create a Cluster**
   - Click "Create Project"
   - Create a new cluster (free tier available)
   - Wait for cluster to deploy (5-10 minutes)

3. **Get Connection String**
   - In Clusters, click "Connect"
   - Select "Drivers"
   - Choose Node.js driver
   - Copy the connection string
   - Replace `<password>` with your database user password

---

### Step 3: Setup Backend

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment Variables File**
   ```bash
   # Copy the example file
   cp .env.example .env

   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```

4. **Edit `.env` File**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/edusphere
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edusphere?retryWrites=true&w=majority

   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_12345
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_change_in_production
   REFRESH_TOKEN_EXPIRE=30d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Seed Sample Data (Optional but Recommended)**
   ```bash
   npm run seed
   ```

   This will create:
   - 3 student accounts
   - 2 instructor accounts
   - 1 admin account
   - 4 sample courses
   - Sample quizzes and assignments

6. **Start Backend Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000
   MongoDB Connected: localhost
   ```

7. **Test Backend is Running**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"success":true,"message":"Server is running"}
   ```

---

### Step 4: Setup Frontend

1. **Open New Terminal and Navigate to Frontend**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment Variables File**
   ```bash
   # Copy the example file
   cp .env.example .env

   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```

4. **Edit `.env` File**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  ready in 123 ms
   ```

6. **Access the Application**
   - Open browser and go to `http://localhost:5173`
   - You should see the EduSphere login page

---

## 🧪 Testing the Application

### Login with Test Credentials

After running seed data, use these credentials:

**Student Account:**
- Email: `john@example.com`
- Password: `password123`

**Instructor Account:**
- Email: `alice@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

### Test Features

#### 1. Test Student Features
- Login as student (john@example.com)
- Browse courses
- Click on a course to view details
- Enroll in a free course
- View course content

#### 2. Test Instructor Features
- Login as instructor (alice@example.com)
- Create a new course
- Add lessons to course
- Publish the course
- View enrolled students

#### 3. Test Admin Features
- Login as admin (admin@example.com)
- View all payments
- Manage users and courses

---

## 🔌 API Testing with Postman

### Import API Collection

1. **Download Postman** from [postman.com](https://www.postman.com/downloads/)

2. **Create New Collection**
   - Click "New" → "Collection"
   - Name it "EduSphere API"

3. **Add API Requests**

#### Sample: Get All Courses
```
GET http://localhost:5000/api/courses
Headers:
  Content-Type: application/json

Expected Response (200):
{
  "success": true,
  "data": [...]
}
```

#### Sample: Login
```
POST http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (200):
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "user": {...}
}
```

---

## 🛠️ Troubleshooting

### Backend Issues

#### 1. MongoDB Connection Error
**Problem:** `Error: Error: ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
- Make sure MongoDB is running (`mongod` or `brew services start mongodb-community`)
- Check MONGODB_URI in .env file
- Verify MongoDB is accessible on localhost:27017

#### 2. Port Already in Use
**Problem:** `Error: listen EADDRINUSE :::5000`

**Solutions:**
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Kill process
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>
```

Or change PORT in .env to another port like 5001

#### 3. Module Not Found
**Problem:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

#### 1. Blank Screen / Page Not Loading
**Problem:** Frontend shows blank page

**Solutions:**
- Check browser console for errors (F12)
- Make sure backend is running (`http://localhost:5000/api/health`)
- Check VITE_API_URL in frontend .env

#### 2. API Calls Not Working
**Problem:** CORS errors or API calls failing

**Solutions:**
- Make sure backend is running on port 5000
- Check VITE_API_URL in .env
- Verify FRONTEND_URL in backend .env is correct

#### 3. Cannot Find Module 'react'
**Problem:** `Cannot find module 'react'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Database Inspection

### Using MongoDB Compass (GUI)

1. **Install MongoDB Compass** from [mongodb.com/compass](https://www.mongodb.com/products/compass)

2. **Connect to Local MongoDB**
   - Click "New Connection"
   - Enter: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Collections**
   - Select database "edusphere"
   - Browse collections (Users, Courses, etc.)
   - View and edit documents

### Using MongoDB Shell (CLI)

```bash
# Start MongoDB shell
mongosh

# View databases
show dbs

# Use edusphere database
use edusphere

# View collections
show collections

# Query users
db.users.find()

# Query courses
db.courses.find()

# Count documents
db.users.countDocuments()

# Exit
exit
```

---

## 📱 Mobile Responsiveness

The application is built with Tailwind CSS and includes responsive design:

- **Desktop (1024px+)**: Full layout with 3-column grid
- **Tablet (768px-1023px)**: 2-column grid
- **Mobile (< 768px)**: 1-column, full-width layout

Test on mobile using browser DevTools (F12) → Toggle Device Toolbar

---

## 🔐 Security Best Practices

### For Production:

1. **Change JWT Secrets**
   ```env
   JWT_SECRET=use_a_strong_random_string_here
   REFRESH_TOKEN_SECRET=use_another_strong_random_string_here
   ```

2. **Enable HTTPS**
   - Use SSL certificates
   - Update frontend URLs to https://

3. **Database Security**
   - Use strong passwords for MongoDB
   - Enable authentication
   - Use IP whitelist for MongoDB Atlas

4. **Environment Variables**
   - Never commit .env file
   - Use production-grade secrets management (AWS Secrets Manager, Azure Key Vault)

5. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Use express-rate-limit package

---

## 🚢 Deployment Guide

### Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create edusphere-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=<your_mongodb_atlas_uri>
   heroku config:set JWT_SECRET=<strong_secret>
   heroku config:set FRONTEND_URL=<your_frontend_url>
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Check Logs**
   ```bash
   heroku logs --tail
   ```

### Deploy Frontend to Vercel

1. **Push Code to GitHub**
   ```bash
   git push origin main
   ```

2. **Go to [Vercel.com](https://vercel.com)**
   - Click "New Project"
   - Import your GitHub repository
   - Set Framework as "Vite"

3. **Set Environment Variables**
   - In project settings → Environment Variables
   - Add: `VITE_API_URL=<your_heroku_backend_url>/api`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live!

---

## 📞 Support & Resources

### Useful Links
- [Node.js Docs](https://nodejs.org/en/docs/)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Introduction](https://jwt.io/introduction)

### Common Tasks

**Reset Database:**
```bash
# Delete all data and reseed
cd backend
npm run seed
```

**View Real-Time Logs:**
```bash
# Backend logs
npm run dev

# Frontend logs (open DevTools - F12)
```

**Update Dependencies:**
```bash
npm update
```

---

## 🎉 You're All Set!

Your EduSphere platform is now running locally! 

**Next Steps:**
1. Explore the application with test credentials
2. Create new courses and content
3. Test all features (quizzes, assignments, payments)
4. Customize styling and branding
5. Deploy to production when ready

---

**Happy Learning! 🚀**
