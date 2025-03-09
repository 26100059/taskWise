import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">User Profile</h1>
      {/* You can add user profile details and edit options here */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="text-blue-500 hover:underline"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ProfilePage;
