// src/pages/Dashboard.js
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Switch from "react-switch";
import axios from "axios";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Task form state
  const [taskInput, setTaskInput] = useState({
    name: "",
    deadline: "",
    duration: "",
    info: "",
  });

  // Time slots state for calendar events
  const [timeSlots, setTimeSlots] = useState([]);

  // Fetch time slots from the backend using axios
  const fetchTimeSlots = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/tasks/timeSlots");
      const formattedSlots = res.data.map((slot) => ({
        id: slot._id,
        title: slot.task_id?.task_name || "No Task Name",
        start: slot.start_time,
        end: slot.end_time,
        extendedProps: { taskId: slot.task_id?._id },
      }));
      setTimeSlots(formattedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  // Handle task form submission
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskInput.name || !taskInput.deadline || !taskInput.duration) return;

    try {
      const response = await fetch("http://localhost:7000/api/scheduling/schedule-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskInput),
      });

      if (response.ok) {
        alert("Task added successfully!");
        setTaskInput({ name: "", deadline: "", duration: "", info: "" });
        fetchTimeSlots(); // Refresh time slots after adding task
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error adding task");
    }
  };


  // Handle event drop (drag & drop update)
  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
    const updatedStart = event.start.toISOString();
    const updatedEnd = event.end ? event.end.toISOString() : updatedStart;

    try {
      await axios.put(`http://localhost:7000/api/tasks/timeSlots/${event.id}`, {
        start_time: updatedStart,
        end_time: updatedEnd,
      });
      fetchTimeSlots();
    } catch (error) {
      console.error("Error updating time slot:", error);
    }
  };

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">Task Wise</div>
        <div className="nav-buttons">
          <button className="export-btn">Export to Google Calendar</button>
          <Switch
            onChange={setIsDarkMode}
            checked={isDarkMode}
            offColor="#ccc"
            onColor="#3b82f6"
            uncheckedIcon={false}
            checkedIcon={false}
            height={22}
            width={44}
            handleDiameter={18}
          />
          <button className="nav-btn" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        {/* Calendar Section */}
        <div className="calendar-section">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            droppable={true}
            minTime="08:00:00"
            maxTime="18:00:00"
            height="100%"
            contentHeight="100%"
            eventDrop={handleEventDrop}
            events={timeSlots}
          />
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          {/* Add Task Form */}
          <div className="add-task">
            <form onSubmit={handleTaskSubmit}>
              <label>Task Name:</label>
              <input
                type="text"
                value={taskInput.name}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, name: e.target.value })
                }
                required
              />
              <label>Deadline:</label>
              <input
                type="datetime-local"
                value={taskInput.deadline}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, deadline: e.target.value })
                }
                required
              />
              <label>Duration (hours):</label>
              <input
                type="number"
                min="1"
                value={taskInput.duration}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, duration: e.target.value })
                }
                required
              />
              <label>Additional Info (Optional):</label>
              <textarea
                value={taskInput.info}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, info: e.target.value })
                }
              ></textarea>
              <button type="submit" className="add-btn">
                Add Task
              </button>
            </form>
          </div>

          {/* Smart Suggestions */}
          <div className="smart-suggestions">
            <h3>Smart Suggestions</h3>
            <div className="suggestion-box">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


