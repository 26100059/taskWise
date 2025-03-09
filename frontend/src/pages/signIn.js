import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Sign In</h1>
      <form className="w-80 bg-white p-6 rounded shadow">
        <div className="mb-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Log In
        </button>
      </form>
      <button 
        onClick={() => navigate('/')}
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SignInPage;
