// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileStats } from '../redux/slices/profileSlice';
import { selectCurrentUser, selectAuthToken } from '../redux/slices/authSlice';
import axios from 'axios';
import { Line as ChartLine, Pie } from 'react-chartjs-2';
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
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { stats : profileStats, status } = useSelector((state) => state.profile);
  const [weeklyTrend, setWeeklyTrend] = useState(null); // State for weekly trend data
    const authToken = useSelector(selectAuthToken); // get token

  useEffect(() => {
    if (user?._id && authToken) {
      // Fetch weekly task data
      axios.get('http://localhost:7000/token/weeklyTaskData', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      .then(response => {
        if (response.data.success) {
          setWeeklyTrend(response.data.weeklyData);
        } else {
          console.error('Failed to fetch weekly task data:', response.data.error);
        }
      })
      .catch(error => {
        console.error('Error fetching weekly task data:', error);
      });

      dispatch(fetchProfileStats());
    }
  }, [dispatch, user?._id, authToken]);

  if (status === 'loading') {
    return <div>Loading profile data...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const userName = profileStats?.name || user.name;
  const xp = profileStats?.xp || 0;
  const level = profileStats?.level || Math.floor(xp / 100) + 1;
  const currentXP = xp % 100;
  const progressPercent = currentXP;

  // Prepare weekly trend data
  const weeklyTrendData = weeklyTrend || { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 }; // Default values
  const weeklyTrendArray = Object.values(weeklyTrendData); // Convert to array

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

  const taskDistribution = { Completed: 0, Pending: 0, Overdue: 0 };
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
  
  let productivityScore = profileStats?.productivity_score; // Get value from profileStats, not analytics

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
