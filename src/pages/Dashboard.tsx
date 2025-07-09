import * as React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import InstructorDashboard from '../components/InstructorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {user.role === 'student' ? <StudentDashboard /> : <InstructorDashboard />}
    </div>
  );
};

export default Dashboard;