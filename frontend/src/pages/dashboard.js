// src/pages/Dashboard.js
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Switch from "react-switch";
import axios from "axios";
import "../styles/dashboard.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

//API BASE 
const API_BASE = process.env.REACT_APP_API_BASE_URL;

// Modal Component for task details
const Modal = ({ task, onClose, onSave }) => {
  const [doneStatus, setDoneStatus] = useState(task.extendedProps.status === "done");

  const handleSave = () => {
    onSave(doneStatus);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{task.title}</h2>
        <p>
          <strong>Start:</strong>{" "}
          {task.start ? new Date(task.start).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>End:</strong>{" "}
          {task.end ? new Date(task.end).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {task.extendedProps.status}
        </p>
        <p>
          <strong>Duration:</strong> {task.extendedProps.duration} hours
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {task.extendedProps.deadline
            ? new Date(task.extendedProps.deadline).toLocaleString()
            : "N/A"}
        </p>
        <div className="modal-status">
          <label>
            <input
              type="checkbox"
              checked={doneStatus}
              onChange={(e) => setDoneStatus(e.target.checked)}
            />
            Mark as done
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch(); // for redux
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  // Redux: Get the token from state
  const token = useSelector((state) => state.auth.user?.token);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  // Task form state
  const [taskInput, setTaskInput] = useState({
    name: "",
    deadline: "",
    duration: "",
    info: "",
  });

  // Loading state for task submission
  const [loading, setLoading] = useState(false);

  // Time slots state for calendar events
  const [timeSlots, setTimeSlots] = useState([]);

  // Selected event for modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // New state for the productivity tip
  const [suggestion, setSuggestion] = useState("");

  // Mobile menu state for hamburger nav
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification state: { type: 'success' | 'failure', message: string }
  const [notification, setNotification] = useState(null);

  // Function to display notification for 2 seconds with a custom message and type
  const showNotification = (message, type) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  // Helper to format dates for ICS (YYYYMMDDTHHmmssZ)
  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Generate ICS file with all events and trigger download
  const generateICSFile = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\n";
    timeSlots.forEach((event) => {
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DTSTART:${formatICSDate(new Date(event.start))}\n`;
      icsContent += `DTEND:${formatICSDate(new Date(event.end))}\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.ics";
    a.click();
  };

  // Fetch time slots from the backend using axios
  const fetchTimeSlots = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/testingDB/timeSlots-by-userid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedSlots = res.data.map((slot) => ({
        id: slot._id,
        title: slot.task_id?.task_name || "No Task Name",
        start: slot.start_time,
        end: slot.end_time,
        extendedProps: {
          taskId: slot.task_id?._id,
          status: slot.task_id?.status || "pending",
          duration: slot.task_id?.duration || "N/A",
          deadline: slot.task_id?.deadline || "",
          info: slot.task_id?.info || "",
        },
      }));
      setTimeSlots(formattedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  }, [token]);

  // Fetch the productivity tip from our suggestions route
  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/suggestions`);
        setSuggestion(response.data.suggestion);
      } catch (error) {
        console.error("Error fetching suggestion:", error);
      }
    };
    fetchSuggestion();
  }, []);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Handle task form submission
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskInput.name || !taskInput.deadline || !taskInput.duration) return;

    // Set loading state to true to disable the button and show loader
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/scheduling/schedule-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskInput),
      });

      if (response.ok) {
        showNotification("Task added successfully!", "success");
        setTaskInput({ name: "", deadline: "", duration: "", info: "" });
        fetchTimeSlots();
      } else {
        // Try to read the error response text from the server
        const errorText = await response.text();
        console.error("Failed to add task:", response.status, errorText);
        showNotification(`Failed to add task: ${response.status} - ${errorText}`, "failure");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      showNotification("Error adding task", "failure");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  // Handle event drop (manual drag & drop update)
  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
    const updatedStart = event.start.toISOString();
    const updatedEnd = event.end ? event.end.toISOString() : updatedStart;
    try {
      await axios.put(
        `${API_BASE}/api/tasks/timeSlots/${event.id}`,
        {
          start_time: updatedStart,
          end_time: updatedEnd,
        }
      );
      fetchTimeSlots();
    } catch (error) {
      console.error("Error updating time slot:", error);
    }
  };

  // Handle event click to show task details modal
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  // Handle saving updated status from modal
  const handleSaveStatus = async (newStatus) => {
    const taskId = selectedEvent.extendedProps.taskId;
    if (!taskId) {
      showNotification("Task ID not found.", "failure");
      return;
    }
    try {
      await axios.put(
        `${API_BASE}/api/tasks/mark-done/${taskId}`,
        {
          status: newStatus ? "done" : "pending",
        }
      );
      showNotification("Task status updated!", "success");
      setSelectedEvent(null);
      fetchTimeSlots();
    } catch (error) {
      console.error("Error updating task status:", error);
      showNotification("Failed to update task status", "failure");
    }
  };

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Logout handler with redux
  const handleLogout = () => {
    console.log("🚪 Logging out...");
    dispatch(logout());
  };

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Notification Banner */}
      {notification && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: notification.type === 'success' ? 'green' : 'red',
            color: '#fff',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <img
            src={require("../assets/navbarIMGnobg.png")}
            alt="Task Wise"
            className="brand-image"
          />
        </div>
        {/* Mobile Navigation */}
        <div className="mobile-nav">
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <button
                className="nav-btn icon-btn export-btn"
                onClick={() => {
                  generateICSFile();
                  setMobileMenuOpen(false);
                }}
                title="Export Calendar"
              >
                <i className="fa-solid fa-download"></i>
              </button>
              <div className="dark-mode-toggle">
                <span className="dark-mode-label">Dark Mode</span>
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
              </div>

              <button
                className="nav-btn icon-btn profile-btn"
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                title="Profile"
              >
                <i className="fa-solid fa-circle-user"></i>
              </button>
              <button className="nav-btn logout" onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}>
                LOG OUT
              </button>
            </div>
          )}
        </div>
        {/* Desktop Navigation */}
        <div className="nav-buttons">
          <button
            className="nav-btn icon-btn export-btn"
            onClick={generateICSFile}
            title="Export Calendar"
          >
            <i className="fa-solid fa-download"></i>
          </button>
          <div className="dark-mode-toggle">
            <span className="dark-mode-label">Dark Mode</span>
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
          </div>
          <button
            className="nav-btn icon-btn profile-btn"
            onClick={() => navigate("/profile")}
            title="Profile"
          >
            <i className="fa-solid fa-circle-user"></i>
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            LOG OUT
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
            eventClick={handleEventClick}
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
              <div className="task-details-row">
                <div className="task-detail">
                  <label>Deadline:</label>
                  <input
                    type="datetime-local"
                    value={taskInput.deadline}
                    onChange={(e) =>
                      setTaskInput({ ...taskInput, deadline: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="task-detail">
                  <label>Duration:</label>
                  <input
                    type="number"
                    min="1"
                    value={taskInput.duration}
                    onChange={(e) =>
                      setTaskInput({ ...taskInput, duration: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <label>Additional Info (Optional):</label>
              <textarea
                value={taskInput.info}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, info: e.target.value })
                }
              ></textarea>
              <button type="submit" className="add-btn" disabled={loading}>
                {loading ? "Adding Task..." : "Add Task"}
              </button>
            </form>
          </div>

          {/* Smart Suggestions */}
          <div className="smart-suggestions">
            <h3>♡ Start your day with our productivity tip:</h3>
            <div className="suggestion-box">
              {suggestion || "Loading suggestion..."}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Task Details */}
      {selectedEvent && (
        <Modal
          task={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
};

export default DashboardPage;
