// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
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

  // Read dark mode preference from local storage on mount
  useEffect(() => {
    const darkModePref = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModePref);
    document.body.classList.toggle("dark-mode", darkModePref);
  }, []);

  // Dummy user data
  const userName = "John Doe";
  const xp = 230;
  const level = Math.floor(xp / 100) + 1;
  const currentXP = xp % 100;
  const progressPercent = currentXP; // out of 100

  // Dummy weekly trend data for tasks completed
  const weeklyTrendArray = [3, 5, 2, 6, 4, 7, 1];

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

  const taskDistribution = { Completed: 5, Pending: 3, Overdue: 2 };
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
