import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/Courses.js';
import enrollmentRoutes from './routes/enrollment.js';

// Configure dotenv to look for .env file in the server directory
dotenv.config({ path: './server/.env',override: true});


// Debug: Log environment variables (remove in production)


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['https://lms-full-stack-portal.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollmentRoutes);

// MongoDB connection
if (process.env.MONGODB_URI) {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI environment variable not set. Database functionality will be disabled.');
  console.log('Please set MONGODB_URI to a valid MongoDB connection string (e.g., MongoDB Atlas)');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
