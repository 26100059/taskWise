// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line as ChartLine, Pie } from 'react-chartjs-2';
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
import axios from 'axios';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cumulativeTime, setCumulativeTime] = useState(0);
  const [weeklyTrendArray, setWeeklyTrendArray] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  

  // Read dark mode preference from local storage on mount
  useEffect(() => {
    const darkModePref = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModePref);
    document.body.classList.toggle("dark-mode", darkModePref);
  }, []);


  const user = useSelector((state) => state.auth.user);
  const userName = user.name;
  const userId = user.userId;
  useEffect(() => {
    const fetchCumulativeTime = async () => {
      if (userId) {  // Use the local userId state
        try {
          const response = await axios.get(`http://localhost:7000/profilePage/${userId}/commulative`);
          setCumulativeTime(response.data.cumulativeTime);
        } catch (error) {
          console.error("Error fetching cumulative time:", error);
        }
      } else {
        console.warn("User ID is not available.");
      }
    };

    fetchCumulativeTime();
  }, [userId]); // Depend on userId
  // console.log("Cumulative Time:", cumulativeTime); // Debugging line
  const xp = cumulativeTime * 10; 



  const level = Math.floor(xp / 100) + 1;
  const currentXP = xp % 100;
  const progressPercent = currentXP;

  useEffect(() => {
    const fetchWeeklyTrend = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:7000/profilePage/${userId}/weekly-completed-tasks`);
          setWeeklyTrendArray(response.data);
        } catch (error) {
          console.error("Error fetching weekly trend:", error);
        }
      } else {
        console.warn("User ID is not available.");
      }
    };

    fetchWeeklyTrend();
  }, [userId]);


  // Adjust font size based on screen width
  const getFontSize = () => {
    const width = window.innerWidth;
    return width > 1300 ? 1.25 : 0.9375; // in rem
  };

  // Update chart options based on dark mode
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: true, 
        position: 'top', 
        labels: { font: { size: 15, color: isDarkMode ? "#fff" : "#333" } },
      },
      title: { 
        display: true, 
        text: 'Weekly Trend', 
        font: { size: getFontSize() * 16, color: isDarkMode ? "#fff" : "#333" },
        padding: { bottom: 10 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1,
          color: isDarkMode ? "#fff" : "#333"
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? "#fff" : "#333"
        }
      }
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { color: isDarkMode ? "#fff" : "#333" }
      },
      title: { 
        display: true, 
        text: 'Tasks by Status',
        color: isDarkMode ? "#fff" : "#333" 
      },
    },
  };

  // Chart data definitions
  const lineData = {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    datasets: [
      {
        label: "Tasks Completed",
        data: weeklyTrendArray,
        fill: false,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "#3b82f6",
      },
    ],
  };

  useEffect(() => {
    const fetchTaskSummary = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:7000/profilePage/${userId}/task-summary`);
          setCompletedTasks(response.data.completed);
          setPendingTasks(response.data.pending);
          setOverdueTasks(response.data.overdue);
        } catch (error) {
          console.error("Error fetching task summary:", error);
        }
      } else {
        console.warn("User ID is not available.");
      }
    };

    fetchTaskSummary();
  }, [userId]);


  const taskDistribution = { Completed: completedTasks, Pending: pendingTasks, Overdue: overdueTasks };
  const pieData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          taskDistribution.Completed, 
          taskDistribution.Pending, 
          taskDistribution.Overdue
        ],
        backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444"],
      },
    ],
  };

  return (
    // Main container: adjust background and text color based on dark mode (dark mode background hard-coded to black)
    <div 
      className="profilePage-container" 
      style={{ backgroundColor: isDarkMode ? "#000" : "var(--background-color)", color: isDarkMode ? "#fff" : "var(--text-color)" }}
    >
      <div className="profilePage-header-wrapper">
        <div className="profilePage-header">
          <div className="profilePage-user-name">
            <h2>{userName}</h2>
          </div>
          <div className="profilePage-user-stats">
            <div className="profilePage-level-display">
              <div className='levelNumber'>Level: {level}</div>
            </div>
            <div className="profilePage-xp-container">
              <div className="profilePage-xp-bar">
                <ProgressBar percent={progressPercent} strokeWidth={5} strokeColor="#3b82f6" />
              </div>
              <div className="profilePage-xp-text">XP: {currentXP}/100</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profilePage-productivity-analytics">
        <div className="profilePage-graphs-container">
          {/* Left graph container: background updates based on dark mode */}
          <div 
            className="profilePage-left-graph" 
            style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
          >
            <ChartLine data={lineData} options={lineOptions} />
          </div>
          {/* Right graph container */}
          <div 
            className="profilePage-right-graph" 
            style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
          >
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
