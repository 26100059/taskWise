import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Import interaction plugin


const DashboardPage = () => {
  const navigate = useNavigate();

  // State for input form
  const [userId, setUserId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");

  // State to store time slots
  const [timeSlots, setTimeSlots] = useState([]);

  // Fetch time slots from the backend
  const fetchTimeSlots = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/tasks/timeSlots"); // Corrected endpoint
      const formattedSlots = res.data.map((slot) => ({
        id: slot._id,
        title: slot.task_id?.task_name || "No Task Name", // Display task name if available
        start: slot.start_time,
        end: slot.end_time, // Ensures proper scheduling
        extendedProps: {
          taskId: slot.task_id?._id, // Store task ID
        },
      }));
      setTimeSlots(formattedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        user_id: userId, // User manually inputs user_id
        task_name: taskName,
        duration: Number(duration),
        deadline: new Date(deadline),
      };

      await axios.post("http://localhost:7000/api/tasks", newTask);

      alert("Task added successfully!");
      setTaskName("");
      setDuration("");
      setDeadline("");
      setUserId("");

      fetchTimeSlots(); // Refresh time slots -> automatically saves new state as well.
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  // Handle event drop (drag-and-drop update)
  const handleEventDrop = async (eventDropInfo) => {
    const { event } = eventDropInfo;
    const updatedStart = event.start.toISOString();
    const updatedEnd = event.end ? event.end.toISOString() : updatedStart;

    try {
      await axios.put(`http://localhost:7000/api/tasks/timeSlots/${event.id}`, {
        start_time: updatedStart,
        end_time: updatedEnd,
      });

      fetchTimeSlots(); // Refresh time slots -> automatically saves new state as well.
    } catch (error) {
      console.error("Error updating time slot:", error);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Create New Task</h2>

        <label className="block mb-2">User ID:</label>
        <input 
          type="text" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
          required
        />

        <label className="block mb-2">Task Name:</label>
        <input 
          type="text" 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
          required
        />

        <label className="block mb-2">Duration (minutes):</label>
        <input 
          type="number" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
          required
        />

        <label className="block mb-2">Deadline:</label>
        <input 
          type="datetime-local" 
          value={deadline} 
          onChange={(e) => setDeadline(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
          required
        />

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>

      {/* FullCalendar to Display Tasks */}
      <div className="mt-10 w-full max-w-4xl bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Your Scheduled Tasks</h2>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]} // Added interaction plugin
          initialView="dayGridMonth"
          events={timeSlots} // Display tasks from DB
          editable={true} // Allow drag & drop
          eventDrop={handleEventDrop} // Handle event drop
          height="600px"
        />
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={() => navigate('/profile')}
        className="mt-6 px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Go to Profile
      </button>
      <button 
        onClick={() => navigate('/')}
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to Home
      </button>
    </div>
  );
};

export default DashboardPage;
