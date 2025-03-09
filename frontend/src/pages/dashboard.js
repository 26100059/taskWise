import React from 'react';
import { useNavigate } from 'react-router-dom';
//saasaasx
const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <button 
        onClick={() => navigate('/profile')}
        className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Go to Profile
      </button>
      <button 
        onClick={() => navigate('/')}
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to Home
      </button>
    </div>
  );
};

export default DashboardPage;
