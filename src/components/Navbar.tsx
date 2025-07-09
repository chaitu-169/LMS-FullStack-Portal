import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Home, BookOpen, User, LogOut, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-indigo-600">
              <GraduationCap className="h-8 w-8" />
              <span>EduPlatform</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/courses"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/courses') 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {user.role === 'instructor' && (
                  <Link
                    to="/create-course"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/create-course') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Course</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;