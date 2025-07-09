import express from 'express';
import Course from '../models/Course.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create new course (instructor only)
router.post('/', authenticate, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const { title, description, duration, difficulty, price } = req.body;

    const course = new Course({
      title,
      description,
      duration,
      difficulty,
      price,
      instructor: req.user._id,
    });

    await course.save();
    await course.populate('instructor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update course (instructor only)
router.put('/:id', authenticate, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    // Check if user is the instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied.' 
      });
    }

    const { title, description, duration, difficulty, price } = req.body;
    
    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.difficulty = difficulty || course.difficulty;
    course.price = price !== undefined ? price : course.price;

    await course.save();
    await course.populate('instructor', 'name email');

    res.json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete course (instructor only)
router.delete('/:id', authenticate, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    // Check if user is the instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied.' 
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get instructor's courses
router.get('/instructor/my-courses', authenticate, authorizeRole('instructor', 'admin'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;