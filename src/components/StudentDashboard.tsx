import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, Clock, User, ExternalLink } from 'lucide-react';

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    instructor: {
      name: string;
      email: string;
    };
    duration: string;
    difficulty: string;
    price: number;
  };
  enrolledAt: string;
  progress: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('/my-courses');
      if (response.data.success) {
        setEnrollments(response.data.enrollments);
      }
    } catch (error) {
      setError('Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-lg text-gray-600">Continue your learning journey</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <div className="lg:col-span-3 grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Hours Studied</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length * 2}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
                <Link
                  to="/courses"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center"
                >
                  Browse More Courses
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(enrollment.course.difficulty)}`}>
                          {enrollment.course.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">
                          {enrollment.course.price === 0 ? 'Free' : `$${enrollment.course.price}`}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{enrollment.course.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{enrollment.course.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-2" />
                          <span>{enrollment.course.instructor.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{enrollment.course.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Link
                        to={`/courses/${enrollment.course._id}`}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;