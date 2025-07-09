import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Enroll in a course
router.post('/enroll/:courseId', authenticate, authorizeRole('student'), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found.' 
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already enrolled in this course.' 
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
    });

    await enrollment.save();

    // Add student to course's enrolled students
    course.enrolledStudents.push(studentId);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course.',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get student's enrolled courses
router.get('/my-courses', authenticate, authorizeRole('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email',
        },
      })
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Check if student is enrolled in a course
router.get('/enrollment-status/:courseId', authenticate, authorizeRole('student'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;