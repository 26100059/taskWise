// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProfilePage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8">User Profile</h1>
//       {/* You can add user profile details and edit options here */}
//       <button 
//         onClick={() => navigate('/dashboard')}
//         className="text-blue-500 hover:underline"
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// };

// export default ProfilePage;




// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProfilePage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8">User Profile</h1>
//       {/* You can add user profile details and edit options here */}
//       <button 
//         onClick={() => navigate('/dashboard')}
//         className="text-blue-500 hover:underline"
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// };

// export default ProfilePage;







// // src/pages/ProfilePage.js
// import React from 'react';
// import { Line as ProgressBar } from 'rc-progress';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line as ChartLine } from 'react-chartjs-2';
// import '../styles/profilePage.css';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ProfilePage = () => {
//   // Dummy user data
//   const user = { name: "John Doe", xp: 150 };
//   const level = Math.floor(user.xp / 100) + 1;
//   const currentXP = user.xp % 100; // XP towards next level
//   const progressPercent = currentXP; // since total is 100

//   // Dummy productivity data: tasks completed per day for the week
//   const lineData = {
//     labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//     datasets: [
//       {
//         label: "Tasks Completed",
//         data: [2, 3, 4, 1, 5, 0, 0],
//         fill: false,
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderColor: "rgba(59, 130, 246, 1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Productivity Analysis',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1, // ensures whole numbers
//         },
//       },
//     },
//   };

//   return (
//     <div className="profile-page-container">
//       {/* Profile Header with light grey background */}
//       <div className="profile-header">
//         <div className="user-name">
//           <h2>{user.name}</h2>
//         </div>
//         <div className="user-stats">
//           <div className="level-display">
//             <span>Level: {level}</span>
//           </div>
//           <div className="xp-container">
//             <div className="xp-bar">
//               <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
//             </div>
//             <div className="xp-text">
//               XP: {currentXP}/100
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Productivity Analysis Section with light grey background */}
//       <div className="productivity-analysis">
//         <ChartLine data={lineData} options={lineOptions} />
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;















// ///latest
// // src/pages/ProfilePage.js
// import React from 'react';
// import { Line as ChartLine, Pie } from 'react-chartjs-2';
// import GaugeChart from 'react-gauge-chart';
// import { Line as ProgressBar } from 'rc-progress';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import '../styles/profilePage.css';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ProfilePage = () => {
//   // Dummy user data
//   const user = { name: "John Doe", xp: 150 };
//   const level = Math.floor(user.xp / 100) + 1;
//   const currentXP = user.xp % 100; // XP toward next level
//   const progressPercent = currentXP; // Total XP per level is 100

//   // Weekly trend: line chart data (tasks completed per day)
//   const lineData = {
//     labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//     datasets: [
//       {
//         label: "Tasks Completed",
//         data: [2, 3, 4, 1, 5, 0, 0],
//         fill: false,
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderColor: "rgba(59, 130, 246, 1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Weekly Trend' },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 },
//       },
//     },
//   };

//   // Pie chart: task distribution by status
//   const pieData = {
//     labels: ["Completed", "Pending", "Overdue"],
//     datasets: [
//       {
//         data: [8, 4, 2],
//         backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Tasks by Status' },
//     },
//   };

//   // Gauge chart: overall productivity score (dummy value between 0 and 1)
//   const productivityScore = 0.65; // e.g. 65%

//   return (
//     <div className="profile-page-container">
//       {/* Profile Header */}
//       <div className="profile-header">
//         <div className="user-name">
//           <h2>{user.name}</h2>
//         </div>
//         <div className="user-stats">
//           <div className="level-display">
//             <span>Level: {level}</span>
//           </div>
//           <div className="xp-container">
//             <div className="xp-bar">
//               <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
//             </div>
//             <div className="xp-text">
//               XP: {currentXP}/100
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Productivity Analytics Section */}
//       <div className="productivity-analytics">
//         <div className="graphs-container">
//           {/* Left: Weekly trend (line chart) */}
//           <div className="left-graph">
//             <ChartLine data={lineData} options={lineOptions} />
//           </div>
//           {/* Right: Stacked Pie and Gauge charts */}
//           <div className="right-graphs">
//             <div className="graph-item">
//               <Pie data={pieData} options={pieOptions} />
//             </div>
//             <div className="graph-item">
//               <div className="gauge-chart-container">
//                 <GaugeChart 
//                   id="gauge-chart" 
//                   nrOfLevels={20} 
//                   percent={productivityScore} 
//                   textColor="#333" 
//                   needleColor="#ef4444"
//                   arcWidth={0.3}
//                 />
//                 <p className="gauge-label">Overall Productivity</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;










// // src/pages/ProfilePage.js
// import React, { useState, useEffect } from 'react';
// import { Line as ChartLine, Pie } from 'react-chartjs-2';
// import GaugeChart from 'react-gauge-chart';
// import { Line as ProgressBar } from 'rc-progress';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import '../styles/profilePage.css';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ProfilePage = () => {
//   // Assume the logged-in user's ID is stored in localStorage
//   const storedUserId = localStorage.getItem('userId') || "defaultUserId";

//   // State for profile stats and analytics
//   const [profileStats, setProfileStats] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch the real data from the backend on component mount
//   useEffect(() => {
//     fetch(`http://localhost:7000/api/profile/${storedUserId}/analytics`)
//       .then((res) => res.json())
//       .then((data) => {
//         // Data structure: { productivity: {...}, profileStats: {...} }
//         setAnalytics(data.productivity);
//         setProfileStats(data.profileStats);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching analytics:", err);
//         setLoading(false);
//       });
//   }, [storedUserId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Use fetched profile stats or fallback to dummy values
//   const userName = profileStats?.name || "John Doe";
//   const xp = profileStats?.xp || 0;
//   const level = Math.floor(xp / 100) + 1;
//   const currentXP = xp % 100;
//   const progressPercent = currentXP; // out of 100

//   // Process weekly trend from analytics
//   const weeklyTrend = analytics?.weeklyTrend || { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };
//   const weeklyTrendArray = [
//     weeklyTrend.MON,
//     weeklyTrend.TUE,
//     weeklyTrend.WED,
//     weeklyTrend.THU,
//     weeklyTrend.FRI,
//     weeklyTrend.SAT,
//     weeklyTrend.SUN,
//   ];

//   const lineData = {
//     labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//     datasets: [
//       {
//         label: "Tasks Completed",
//         data: weeklyTrendArray,
//         fill: false,
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderColor: "rgba(59, 130, 246, 1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Weekly Trend' },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 },
//       },
//     },
//   };

//   // Process task distribution for the pie chart
//   const taskDistribution = analytics?.taskDistribution || { Completed: 0, Pending: 0, Overdue: 0 };
//   const pieData = {
//     labels: ["Completed", "Pending", "Overdue"],
//     datasets: [
//       {
//         data: [
//           taskDistribution.Completed,
//           taskDistribution.Pending,
//           taskDistribution.Overdue,
//         ],
//         backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Tasks by Status' },
//     },
//   };

//   // Determine overall productivity score either from analytics or compute from weekly trend
//   let productivityScore = analytics?.overallProductivity;
//   if (typeof productivityScore !== "number") {
//     const totalTasks = weeklyTrendArray.reduce((sum, val) => sum + val, 0);
//     // For example, target 70 tasks per week for full productivity
//     productivityScore = Math.min(totalTasks / 70, 1);
//   }

//   return (
//     <div className="profile-page-container">
//       {/* Profile Header */}
//       <div className="profile-header">
//         <div className="user-name">
//           <h2>{userName}</h2>
//         </div>
//         <div className="user-stats">
//           <div className="level-display">
//             <span>Level: {level}</span>
//           </div>
//           <div className="xp-container">
//             <div className="xp-bar">
//               <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
//             </div>
//             <div className="xp-text">XP: {currentXP}/100</div>
//           </div>
//         </div>
//       </div>

//       {/* Productivity Analytics Section */}
//       <div className="productivity-analytics">
//         <div className="graphs-container">
//           {/* Left: Weekly Trend (Line Chart) */}
//           <div className="left-graph">
//             <ChartLine data={lineData} options={lineOptions} />
//           </div>
//           {/* Right: Stacked Pie and Gauge Charts */}
//           <div className="right-graphs">
//             <div className="graph-item">
//               <Pie data={pieData} options={pieOptions} />
//             </div>
//             <div className="graph-item">
//               <div className="gauge-chart-container">
//                 <GaugeChart 
//                   id="gauge-chart" 
//                   nrOfLevels={20} 
//                   percent={productivityScore} 
//                   textColor="#333" 
//                   needleColor="#ef4444"
//                   arcWidth={0.3}
//                 />
//                 <p className="gauge-label">Overall Productivity</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

















// // src/pages/ProfilePage.js
// import React, { useState, useEffect, useContext } from 'react';
// import { Line as ChartLine, Pie } from 'react-chartjs-2';
// import GaugeChart from 'react-gauge-chart';
// import { Line as ProgressBar } from 'rc-progress';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import '../styles/profilePage.css';
// import { AuthContext } from '../context/AuthContext';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ProfilePage = () => {
//   const { user } = useContext(AuthContext);

//   // If no user is logged in, you could redirect or show a message.
//   if (!user) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   // Use the logged in user's _id to fetch analytics
//   const userId = user._id;

//   // State for profile stats and analytics data
//   const [profileStats, setProfileStats] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch the data from the backend using the logged in user's id
//   useEffect(() => {
//     fetch(`http://localhost:7000/api/profile/${userId}/analytics`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAnalytics(data.productivity);
//         setProfileStats(data.profileStats);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching analytics:", err);
//         setLoading(false);
//       });
//   }, [userId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Use fetched profile stats or fallback values
//   const userName = profileStats?.name || user.name;
//   const xp = profileStats?.xp || 0;
//   const level = Math.floor(xp / 100) + 1;
//   const currentXP = xp % 100;
//   const progressPercent = currentXP; // out of 100

//   // Process weekly trend data
//   const weeklyTrend = analytics?.weeklyTrend || { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };
//   const weeklyTrendArray = [
//     weeklyTrend.MON,
//     weeklyTrend.TUE,
//     weeklyTrend.WED,
//     weeklyTrend.THU,
//     weeklyTrend.FRI,
//     weeklyTrend.SAT,
//     weeklyTrend.SUN,
//   ];

//   const lineData = {
//     labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//     datasets: [
//       {
//         label: "Tasks Completed",
//         data: weeklyTrendArray,
//         fill: false,
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderColor: "rgba(59, 130, 246, 1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Weekly Trend' },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 },
//       },
//     },
//   };

//   // Process task distribution for pie chart
//   const taskDistribution = analytics?.taskDistribution || { Completed: 0, Pending: 0, Overdue: 0 };
//   const pieData = {
//     labels: ["Completed", "Pending", "Overdue"],
//     datasets: [
//       {
//         data: [
//           taskDistribution.Completed,
//           taskDistribution.Pending,
//           taskDistribution.Overdue,
//         ],
//         backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Tasks by Status' },
//     },
//   };

//   // Determine overall productivity score either from analytics or computed from trend
//   let productivityScore = analytics?.overallProductivity;
//   if (typeof productivityScore !== "number") {
//     const totalTasks = weeklyTrendArray.reduce((sum, val) => sum + val, 0);
//     // Example: target 70 tasks per week for full productivity
//     productivityScore = Math.min(totalTasks / 70, 1);
//   }

//   return (
//     <div className="profile-page-container">
//       {/* Profile Header */}
//       <div className="profile-header">
//         <div className="user-name">
//           <h2>{userName}</h2>
//         </div>
//         <div className="user-stats">
//           <div className="level-display">
//             <span>Level: {level}</span>
//           </div>
//           <div className="xp-container">
//             <div className="xp-bar">
//               <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
//             </div>
//             <div className="xp-text">XP: {currentXP}/100</div>
//           </div>
//         </div>
//       </div>

//       {/* Productivity Analytics Section */}
//       <div className="productivity-analytics">
//         <div className="graphs-container">
//           {/* Left: Weekly Trend (Line Chart) */}
//           <div className="left-graph">
//             <ChartLine data={lineData} options={lineOptions} />
//           </div>
//           {/* Right: Stacked Pie and Gauge Charts */}
//           <div className="right-graphs">
//             <div className="graph-item">
//               <Pie data={pieData} options={pieOptions} />
//             </div>
//             <div className="graph-item">
//               <div className="gauge-chart-container">
//                 <GaugeChart 
//                   id="gauge-chart" 
//                   nrOfLevels={20} 
//                   percent={productivityScore} 
//                   textColor="#333" 
//                   needleColor="#ef4444"
//                   arcWidth={0.3}
//                 />
//                 <p className="gauge-label">Overall Productivity</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;










// // src/pages/ProfilePage.js
// import React, { useState, useEffect, useContext } from 'react';
// import { Line as ChartLine, Pie } from 'react-chartjs-2';
// import GaugeChart from 'react-gauge-chart';
// import { Line as ProgressBar } from 'rc-progress';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import '../styles/profilePage.css';
// import { AuthContext } from '../context/AuthContext';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ProfilePage = () => {
//   const { user } = useContext(AuthContext);

//   // Unconditionally call all hooks
//   const [profileStats, setProfileStats] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch data from the backend (only if user exists)
//   useEffect(() => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }
//     fetch(`http://localhost:7000/api/profile/${user._id}/analytics`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAnalytics(data.productivity);
//         setProfileStats(data.profileStats);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching analytics:", err);
//         setLoading(false);
//       });
//   }, [user]);

//   // If no user, render a message (after hooks have been called)
//   if (!user) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Use fetched profile stats or fallback values
//   const userName = profileStats?.name || user.name;
//   const xp = profileStats?.xp || 0;
//   const level = Math.floor(xp / 100) + 1;
//   const currentXP = xp % 100;
//   const progressPercent = currentXP; // out of 100

//   // Process weekly trend data
//   const weeklyTrend = analytics?.weeklyTrend || { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };
//   const weeklyTrendArray = [
//     weeklyTrend.MON,
//     weeklyTrend.TUE,
//     weeklyTrend.WED,
//     weeklyTrend.THU,
//     weeklyTrend.FRI,
//     weeklyTrend.SAT,
//     weeklyTrend.SUN,
//   ];

//   const lineData = {
//     labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//     datasets: [
//       {
//         label: "Tasks Completed",
//         data: weeklyTrendArray,
//         fill: false,
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderColor: "rgba(59, 130, 246, 1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Weekly Trend' },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 },
//       },
//     },
//   };

//   // Process task distribution for pie chart
//   const taskDistribution = analytics?.taskDistribution || { Completed: 0, Pending: 0, Overdue: 0 };
//   const pieData = {
//     labels: ["Completed", "Pending", "Overdue"],
//     datasets: [
//       {
//         data: [
//           taskDistribution.Completed,
//           taskDistribution.Pending,
//           taskDistribution.Overdue,
//         ],
//         backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Tasks by Status' },
//     },
//   };

//   // Determine overall productivity score either from analytics or computed from trend
//   let productivityScore = analytics?.overallProductivity;
//   if (typeof productivityScore !== "number") {
//     const totalTasks = weeklyTrendArray.reduce((sum, val) => sum + val, 0);
//     // Example: target 70 tasks per week for full productivity
//     productivityScore = Math.min(totalTasks / 70, 1);
//   }

//   return (
//     <div className="profile-page-container">
//       {/* Profile Header */}
//       <div className="profile-header">
//         <div className="user-name">
//           <h2>{userName}</h2>
//         </div>
//         <div className="user-stats">
//           <div className="level-display">
//             <span>Level: {level}</span>
//           </div>
//           <div className="xp-container">
//             <div className="xp-bar">
//               <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
//             </div>
//             <div className="xp-text">XP: {currentXP}/100</div>
//           </div>
//         </div>
//       </div>

//       {/* Productivity Analytics Section */}
//       <div className="productivity-analytics">
//         <div className="graphs-container">
//           {/* Left: Weekly Trend (Line Chart) */}
//           <div className="left-graph">
//             <ChartLine data={lineData} options={lineOptions} />
//           </div>
//           {/* Right: Stacked Pie and Gauge Charts */}
//           <div className="right-graphs">
//             <div className="graph-item">
//               <Pie data={pieData} options={pieOptions} />
//             </div>
//             <div className="graph-item">
//               <div className="gauge-chart-container">
//                 <GaugeChart 
//                   id="gauge-chart" 
//                   nrOfLevels={20} 
//                   percent={productivityScore} 
//                   textColor="#333" 
//                   needleColor="#ef4444"
//                   arcWidth={0.3}
//                 />
//                 <p className="gauge-label">Overall Productivity</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;






// // src/pages/ProfilePage.js
// import React, { useState, useEffect, useContext } from 'react';
// import { Line as ChartLine, Pie } from 'react-chartjs-2';
// import GaugeChart from 'react-gauge-chart';
// import { Line as ProgressBar } from 'rc-progress';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import '../styles/profilePage.css';
// import { AuthContext } from '../context/AuthContext';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ProfilePage = () => {
//   const { user } = useContext(AuthContext);

//   // Hooks are always called unconditionally
//   const [profileStats, setProfileStats] = useState(null);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch data from the backend using the logged-in user's ID
//   useEffect(() => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }
//     fetch(`http://localhost:7000/api/profile/${user._id}/analytics`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAnalytics(data.productivity);
//         setProfileStats(data.profileStats);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching analytics:", err);
//         setLoading(false);
//       });
//   }, [user]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   const userName = profileStats?.name || user.name;
//   const xp = profileStats?.xp || 0;
//   // const level = Math.floor(xp / 100) + 1;
//   // const level = profileStats?.level;
//   const level = profileStats?.level || Math.floor(xp / 100) + 1;

//   const currentXP = xp % 100;
//   const progressPercent = currentXP; // out of 100

//   // Process weekly trend data
//   const weeklyTrend = analytics?.weeklyTrend || { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };
//   const weeklyTrendArray = [
//     weeklyTrend.MON,
//     weeklyTrend.TUE,
//     weeklyTrend.WED,
//     weeklyTrend.THU,
//     weeklyTrend.FRI,
//     weeklyTrend.SAT,
//     weeklyTrend.SUN,
//   ];

//   const lineData = {
//     labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
//     datasets: [
//       {
//         label: "Tasks Completed",
//         data: weeklyTrendArray,
//         fill: false,
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderColor: "rgba(59, 130, 246, 1)",
//       },
//     ],
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Weekly Trend' },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 1 },
//       },
//     },
//   };

//   const taskDistribution = analytics?.taskDistribution || { Completed: 0, Pending: 0, Overdue: 0 };
//   const pieData = {
//     labels: ["Completed", "Pending", "Overdue"],
//     datasets: [
//       {
//         data: [
//           taskDistribution.Completed,
//           taskDistribution.Pending,
//           taskDistribution.Overdue,
//         ],
//         backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'bottom' },
//       title: { display: true, text: 'Tasks by Status' },
//     },
//   };

//   let productivityScore = analytics?.overallProductivity;
//   if (typeof productivityScore !== "number") {
//     const totalTasks = weeklyTrendArray.reduce((sum, val) => sum + val, 0);
//     productivityScore = Math.min(totalTasks / 70, 1);
//   }

//   return (
//     <div className="profile-page-container">
//       <div className="profile-header">
//         <div className="user-name">
//           <h2>{userName}</h2>
//         </div>
//         <div className="user-stats">
//           <div className="level-display">
//             <span>Level: {level}</span>
//           </div>
//           <div className="xp-container">
//             <div className="xp-bar">
//               <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
//             </div>
//             <div className="xp-text">XP: {currentXP}/100</div>
//           </div>
//         </div>
//       </div>

//       <div className="productivity-analytics">
//         <div className="graphs-container">
//           <div className="left-graph">
//             <ChartLine data={lineData} options={lineOptions} />
//           </div>
//           <div className="right-graphs">
//             <div className="graph-item">
//               <Pie data={pieData} options={pieOptions} />
//             </div>
//             <div className="graph-item">
//               <div className="gauge-chart-container">
//                 <GaugeChart 
//                   id="gauge-chart" 
//                   nrOfLevels={20} 
//                   percent={productivityScore} 
//                   textColor="#333" 
//                   needleColor="#ef4444"
//                   arcWidth={0.3}
//                 />
//                 <p className="gauge-label">Overall Productivity</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;




// src/pages/ProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import { Line as ChartLine, Pie } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import { Line as ProgressBar } from 'rc-progress';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/profilePage.css';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  // Unconditionally call all hooks
  const [profileStats, setProfileStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend using the logged-in user's ID
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:7000/api/profile/${user._id}/analytics`)
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.productivity);
        setProfileStats(data.profileStats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const userName = profileStats?.name || user.name;
  const xp = profileStats?.xp || 0;
  const level = profileStats?.level || Math.floor(xp / 100) + 1;
  const currentXP = xp % 100;
  const progressPercent = currentXP; // out of 100

  // Process weekly trend data
  const weeklyTrend = analytics?.weeklyTrend || { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };
  const weeklyTrendArray = [
    weeklyTrend.MON,
    weeklyTrend.TUE,
    weeklyTrend.WED,
    weeklyTrend.THU,
    weeklyTrend.FRI,
    weeklyTrend.SAT,
    weeklyTrend.SUN,
  ];

  const lineData = {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    datasets: [
      {
        label: "Tasks Completed",
        data: weeklyTrendArray,
        fill: false,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Trend' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const taskDistribution = analytics?.taskDistribution || { Completed: 0, Pending: 0, Overdue: 0 };
  const pieData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          taskDistribution.Completed,
          taskDistribution.Pending,
          taskDistribution.Overdue,
        ],
        backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Tasks by Status' },
    },
  };

  let productivityScore = analytics?.overallProductivity;
  if (typeof productivityScore !== "number") {
    const totalTasks = weeklyTrendArray.reduce((sum, val) => sum + val, 0);
    productivityScore = Math.min(totalTasks / 70, 1);
  }

  return (
    <div className="profilePage-container">
      <div className="profilePage-header">
        <div className="profilePage-user-name">
          <h2>{userName}</h2>
        </div>
        <div className="profilePage-user-stats">
          <div className="profilePage-level-display">
            <span>Level: {level}</span>
          </div>
          <div className="profilePage-xp-container">
            <div className="profilePage-xp-bar">
              <ProgressBar percent={progressPercent} strokeWidth="4" strokeColor="#3b82f6" />
            </div>
            <div className="profilePage-xp-text">XP: {currentXP}/100</div>
          </div>
        </div>
      </div>

      <div className="profilePage-productivity-analytics">
        <div className="profilePage-graphs-container">
          <div className="profilePage-left-graph">
            <ChartLine data={lineData} options={lineOptions} />
          </div>
          <div className="profilePage-right-graphs">
            <div className="profilePage-graph-item">
              <Pie data={pieData} options={pieOptions} />
            </div>
            <div className="profilePage-graph-item">
              <div className="profilePage-gauge-chart-container">
                <GaugeChart 
                  id="gauge-chart" 
                  nrOfLevels={20} 
                  percent={productivityScore} 
                  textColor="#333" 
                  needleColor="#ef4444"
                  arcWidth={0.3}
                />
                <p className="profilePage-gauge-label">Overall Productivity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
