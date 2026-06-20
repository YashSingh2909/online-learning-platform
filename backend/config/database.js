import mongoose from 'mongoose';

let memoryServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusphere';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Primary MongoDB connection failed: ${error.message}`);

    // If no environment URI provided, fall back to an in-memory MongoDB for testing
    if (!process.env.MONGODB_URI) {
      try {
        console.log('Starting in-memory MongoDB for testing...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const uri = memoryServer.getUri();
        const conn = await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected to in-memory MongoDB');
        return conn;
      } catch (memErr) {
        console.error('In-memory MongoDB start failed:', memErr.message);
        // Do not exit; allow server to run for limited testing (endpoints may fail)
      }
    }

    // If we reach here, return null so server can continue (routes should handle DB absence)
    return null;
  }
};

export default connectDB;
