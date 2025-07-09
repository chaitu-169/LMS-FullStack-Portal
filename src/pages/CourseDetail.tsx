import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Clock, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  duration: string;
  difficulty: string;
  price: number;
  enrolledStudents: string[];
  createdAt: string;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCourse();
      if (user?.role === 'student') {
        checkEnrollmentStatus();
      }
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/courses/${id}`);
      if (response.data.success) {
        setCourse(response.data.course);
      }
    } catch (error) {
      setError('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await axios.get(`/enrollment-status/${id}`);
      if (response.data.success) {
        setIsEnrolled(response.data.isEnrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      const response = await axios.post(`/enroll/${id}`);
      if (response.data.success) {
        setIsEnrolled(true);
        alert('Successfully enrolled in the course!');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Course not found</h3>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.enrolledStudents.length} students enrolled
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{course.description}</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Instructor:</span>
                    <span className="ml-2">{course.instructor.name}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">{course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll learn</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">Comprehensive understanding of the subject</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">Practical skills and real-world applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Courses
              </button>

              {user?.role === 'student' && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || isEnrolled}
                  className={`px-8 py-3 rounded-md font-medium transition-colors ${
                    isEnrolled
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {enrolling ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </div>
                  ) : isEnrolled ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Enrolled
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Enroll Now
                    </div>
                  )}
                </button>
              )}

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Login to Enroll
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;