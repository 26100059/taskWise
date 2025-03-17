import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:7000/testingDB'

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch (`${API_BASE}/usersregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('User registered successfully!');
        navigate('/');
      } else {
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          alert('Failed to register user. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        // Handle other unexpected errors
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Sign Up</h1>
      <form className="w-80 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input 
            type="text" 
            name="name"
            placeholder="Username" 
            className="w-full px-3 py-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            className="w-full px-3 py-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            className="w-full px-3 py-2 border rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button onClick={handleSubmit} type="submit" className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register
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

export default SignUpPage;