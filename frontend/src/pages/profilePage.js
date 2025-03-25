// src/pages/ProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import { Line as ChartLine, Pie } from 'react-chartjs-2';
// import GaugeChart from 'react-gauge-chart';
import GaugeComponent from "react-gauge-component";
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
                <GaugeComponent
                  value={productivityScore * 100}  // Convert percent (0-1) to 0-100 range. productivity score should be 0-1
                  arc={{
                    subArcs: [
                      { limit: 20, color: "#EA4228" },
                      { limit: 40, color: "#F58B19" },
                      { limit: 60, color: "#F5CD19" },
                      { limit: 100, color: "#5BE12C" }
                    ],
                    width: 0.3, // Similar to `arcWidth`
                  }}
                  pointer={{
                    color: "#ef4444" // Same as `needleColor`
                  }}
                  labels={{
                    valueLabel: { style: { fill: "#333" } } // Similar to `textColor`
                  }}
                />
                {/* <GaugeChart 
                  id="gauge-chart" 
                  nrOfLevels={20} 
                  percent={productivityScore} 
                  textColor="#333" 
                  needleColor="#ef4444"
                  arcWidth={0.3}
                /> */}
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
