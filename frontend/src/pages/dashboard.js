// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const DashboardPage = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/signin');
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
//       <button 
//         onClick={() => navigate('/profile')}
//         className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-4"
//       >
//         Go to Profile
//       </button>

//       <button 
//         onClick={() => navigate('/testingDB')}
//         className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
//       >
//         Test DB
//       </button>

//       <button 
//         onClick={handleLogout}
//         className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4"
//       >
//         Logout
//       </button>

//       <button 
//         onClick={() => navigate('/')}
//         className="text-blue-500 hover:underline"
//       >
//         Back to Home
//       </button>
//     </div>
//   );
// };

// export default DashboardPage;




import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <button 
        onClick={() => navigate('/profile')}
        className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-4"
      >
        Go to Profile
      </button>

      <button 
        onClick={() => navigate('/testingDB')}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4"
      >
        Test DB
      </button>

      <button 
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4"
      >
        Logout
      </button>

      <button 
        onClick={() => navigate('/')}
        className="text-blue-500 hover:underline"
      >
        Back to Home
      </button>
    </div>
  );
};

export default DashboardPage;