import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database.js';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import uploadStudentRoutes from './routes/uploadStudentRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import { seedDemoData } from './seed/demoSeed.js';


dotenv.config();

const app = express();

// =====================
// CORS
// =====================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'http://127.0.0.1:5177',
].filter(Boolean);

const allowedOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOriginRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy does not allow access from this origin'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// STATIC FILE FIX (🔥 THIS WAS MISSING)
// =====================
app.use('/uploads', express.static(path.resolve('uploads')));

// ✅ FIX FOR CERTIFICATES DOWNLOAD
app.use('/certificates', express.static(path.resolve('certificates')));

// =====================
// START SERVER
// =====================
const startServer = async () => {
  const dbConnection = await connectDB();
  if (!dbConnection) {
    console.error('Database connection failed, aborting server startup.');
    return;
  }

  await seedDemoData();

  // Routes
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/uploads', uploadStudentRoutes);

  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/assignments', assignmentRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/certificates', certificateRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/rag', ragRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });
  
  app.set('io', io);
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join_course', (courseId) => {
      socket.join(courseId);
    });
    
    socket.on('send_message', async (data) => {
      console.log('[socket] send_message received:', {
        courseId: data?.courseId,
        senderId: data?.senderId,
        content: data?.content,
      });

      try {
        const message = await Message.create({
          course: data.courseId,
          sender: data.senderId,
          content: data.content,
        });

        // Verify immediately what got persisted (helps debugging refresh issues)
        const persistedCount = await Message.countDocuments({ course: data.courseId });
        console.log('[socket] persisted messages count for course (raw):', data.courseId, persistedCount);

        // Extra verification using stringified course id (helps ObjectId/string mismatch debugging)
        const persistedCountStr = await Message.countDocuments({ course: String(data.courseId) });
        console.log('[socket] persisted messages count for course (string):', String(data.courseId), persistedCountStr);



        console.log('[socket] message saved:', {
          _id: message._id,
          course: message.course,
          sender: message.sender,
          content: message.content,
        });

        await message.populate('sender', 'name profileImage');
        io.to(data.courseId).emit('receive_message', message);
      } catch (err) {
        console.error('[socket] Error saving message:', err);
      }
    });

    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Server error:', error);
    }
  });
};

startServer();
