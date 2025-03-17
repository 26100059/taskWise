import React, { useState } from 'react';

const API_BASE = 'http://localhost:7000/testingDB';

const TestingDB = () => {
  /* ----- USERS STATE & HANDLERS ----- */
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
  const [userUpdateId, setUserUpdateId] = useState('');
  const [userUpdateData, setUserUpdateData] = useState({ name: '', email: '', password: '' });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      alert('User created: ' + data._id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${userUpdateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userUpdateData)
      });
      const data = await res.json();
      alert('User updated: ' + data._id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      alert('User deleted');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const [protectedData, setProtectedData] = useState(null);
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/protected`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setProtectedData(data);
      } else {
        alert(data.error || "Failed to fetch protected data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  /* ----- TASKS STATE & HANDLERS ----- */
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ user_id: '', task_name: '', duration: 0, deadline: '', status: 'pending' });
  const [taskUpdateId, setTaskUpdateId] = useState('');
  const [taskUpdateData, setTaskUpdateData] = useState({ user_id: '', task_name: '', duration: 0, deadline: '', status: 'pending' });

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      });
      const data = await res.json();
      alert('Task created: ' + data._id);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskUpdateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskUpdateData)
      });
      const data = await res.json();
      alert('Task updated: ' + data._id);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      alert('Task deleted');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  /* ----- TIME SLOTS STATE & HANDLERS ----- */
  const [timeslots, setTimeSlots] = useState([]);
  const [timeslotForm, setTimeSlotForm] = useState({ task_id: '', start_time: '', end_time: '' });
  const [timeslotUpdateId, setTimeSlotUpdateId] = useState('');
  const [timeslotUpdateData, setTimeSlotUpdateData] = useState({ task_id: '', start_time: '', end_time: '' });

  const fetchTimeSlots = async () => {
    try {
      const res = await fetch(`${API_BASE}/timeslots`);
      const data = await res.json();
      setTimeSlots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTimeSlot = async () => {
    try {
      const res = await fetch(`${API_BASE}/timeslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timeslotForm)
      });
      const data = await res.json();
      alert('Time slot created: ' + data._id);
      fetchTimeSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTimeSlot = async () => {
    try {
      const res = await fetch(`${API_BASE}/timeslots/${timeslotUpdateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timeslotUpdateData)
      });
      const data = await res.json();
      alert('Time slot updated: ' + data._id);
      fetchTimeSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTimeSlot = async (id) => {
    try {
      await fetch(`${API_BASE}/timeslots/${id}`, { method: 'DELETE' });
      alert('Time slot deleted');
      fetchTimeSlots();
    } catch (err) {
      console.error(err);
    }
  };

  /* ----- SUGGESTIONS STATE & HANDLERS ----- */
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionForm, setSuggestionForm] = useState({ user_id: '', suggestion_text: '' });
  const [suggestionUpdateId, setSuggestionUpdateId] = useState('');
  const [suggestionUpdateData, setSuggestionUpdateData] = useState({ user_id: '', suggestion_text: '' });

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/suggestions`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createSuggestion = async () => {
    try {
      const res = await fetch(`${API_BASE}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionForm)
      });
      const data = await res.json();
      alert('Suggestion created: ' + data._id);
      fetchSuggestions();
    } catch (err) {
      console.error(err);
    }
  };

  const updateSuggestion = async () => {
    try {
      const res = await fetch(`${API_BASE}/suggestions/${suggestionUpdateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionUpdateData)
      });
      const data = await res.json();
      alert('Suggestion updated: ' + data._id);
      fetchSuggestions();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSuggestion = async (id) => {
    try {
      await fetch(`${API_BASE}/suggestions/${id}`, { method: 'DELETE' });
      alert('Suggestion deleted');
      fetchSuggestions();
    } catch (err) {
      console.error(err);
    }
  };

  /* ----- USER PROFILE STATS STATE & HANDLERS ----- */
  const [stats, setStats] = useState([]);
  const [statsForm, setStatsForm] = useState({ user_id: '', xp: 0, level: 1, productivity_score: 0 });
  const [statsUpdateId, setStatsUpdateId] = useState('');
  const [statsUpdateData, setStatsUpdateData] = useState({ user_id: '', xp: 0, level: 1, productivity_score: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/userprofilestats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/userprofilestats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statsForm)
      });
      const data = await res.json();
      alert('Stats created: ' + data._id);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/userprofilestats/${statsUpdateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statsUpdateData)
      });
      const data = await res.json();
      alert('Stats updated: ' + data._id);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStats = async (id) => {
    try {
      await fetch(`${API_BASE}/userprofilestats/${id}`, { method: 'DELETE' });
      alert('Stats deleted');
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Testing Database CRUD Operations</h1>
      <hr />

      {/* USERS SECTION */}
      <section>
        <h2>Users</h2>
        <button onClick={fetchUsers}>Fetch Users</button>
        <div>
          <input placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
          <input placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
          <input placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
          <button onClick={createUser}>Create User</button>
        </div>
        <div>
          <input placeholder="Update User ID" value={userUpdateId} onChange={(e) => setUserUpdateId(e.target.value)} />
          <input placeholder="Name" value={userUpdateData.name} onChange={(e) => setUserUpdateData({ ...userUpdateData, name: e.target.value })} />
          <input placeholder="Email" value={userUpdateData.email} onChange={(e) => setUserUpdateData({ ...userUpdateData, email: e.target.value })} />
          <input placeholder="Password" value={userUpdateData.password} onChange={(e) => setUserUpdateData({ ...userUpdateData, password: e.target.value })} />
          <button onClick={updateUser}>Update User</button>
        </div>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email} <button onClick={() => deleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      <hr />

      {/* TASKS SECTION */}
      <section>
        <h2>Tasks</h2>
        <button onClick={fetchTasks}>Fetch Tasks</button>
        <div>
          <input placeholder="User ID" value={taskForm.user_id} onChange={(e) => setTaskForm({ ...taskForm, user_id: e.target.value })} />
          <input placeholder="Task Name" value={taskForm.task_name} onChange={(e) => setTaskForm({ ...taskForm, task_name: e.target.value })} />
          <input placeholder="Duration" type="number" value={taskForm.duration} onChange={(e) => setTaskForm({ ...taskForm, duration: Number(e.target.value) })} />
          <input placeholder="Deadline (YYYY-MM-DDTHH:MM)" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
          <input placeholder="Status" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} />
          <button onClick={createTask}>Create Task</button>
        </div>
        <div>
          <input placeholder="Update Task ID" value={taskUpdateId} onChange={(e) => setTaskUpdateId(e.target.value)} />
          <input placeholder="User ID" value={taskUpdateData.user_id} onChange={(e) => setTaskUpdateData({ ...taskUpdateData, user_id: e.target.value })} />
          <input placeholder="Task Name" value={taskUpdateData.task_name} onChange={(e) => setTaskUpdateData({ ...taskUpdateData, task_name: e.target.value })} />
          <input placeholder="Duration" type="number" value={taskUpdateData.duration} onChange={(e) => setTaskUpdateData({ ...taskUpdateData, duration: Number(e.target.value) })} />
          <input placeholder="Deadline (YYYY-MM-DDTHH:MM)" value={taskUpdateData.deadline} onChange={(e) => setTaskUpdateData({ ...taskUpdateData, deadline: e.target.value })} />
          <input placeholder="Status" value={taskUpdateData.status} onChange={(e) => setTaskUpdateData({ ...taskUpdateData, status: e.target.value })} />
          <button onClick={updateTask}>Update Task</button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {task.task_name} - {task.duration} min - {task.status} <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      <hr />

      {/* TIME SLOTS SECTION */}
      <section>
        <h2>Time Slots</h2>
        <button onClick={fetchTimeSlots}>Fetch Time Slots</button>
        <div>
          <input placeholder="Task ID" value={timeslotForm.task_id} onChange={(e) => setTimeSlotForm({ ...timeslotForm, task_id: e.target.value })} />
          <input placeholder="Start Time (YYYY-MM-DDTHH:MM)" value={timeslotForm.start_time} onChange={(e) => setTimeSlotForm({ ...timeslotForm, start_time: e.target.value })} />
          <input placeholder="End Time (YYYY-MM-DDTHH:MM)" value={timeslotForm.end_time} onChange={(e) => setTimeSlotForm({ ...timeslotForm, end_time: e.target.value })} />
          <button onClick={createTimeSlot}>Create Time Slot</button>
        </div>
        <div>
          <input placeholder="Update Time Slot ID" value={timeslotUpdateId} onChange={(e) => setTimeSlotUpdateId(e.target.value)} />
          <input placeholder="Task ID" value={timeslotUpdateData.task_id} onChange={(e) => setTimeSlotUpdateData({ ...timeslotUpdateData, task_id: e.target.value })} />
          <input placeholder="Start Time (YYYY-MM-DDTHH:MM)" value={timeslotUpdateData.start_time} onChange={(e) => setTimeSlotUpdateData({ ...timeslotUpdateData, start_time: e.target.value })} />
          <input placeholder="End Time (YYYY-MM-DDTHH:MM)" value={timeslotUpdateData.end_time} onChange={(e) => setTimeSlotUpdateData({ ...timeslotUpdateData, end_time: e.target.value })} />
          <button onClick={updateTimeSlot}>Update Time Slot</button>
        </div>
        <ul>
          {timeslots.map((slot) => (
            <li key={slot._id}>
              Task: {slot.task_id} - {slot.start_time} to {slot.end_time} <button onClick={() => deleteTimeSlot(slot._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      <hr />

      {/* SUGGESTIONS SECTION */}
      <section>
        <h2>Suggestions</h2>
        <button onClick={fetchSuggestions}>Fetch Suggestions</button>
        <div>
          <input placeholder="User ID" value={suggestionForm.user_id} onChange={(e) => setSuggestionForm({ ...suggestionForm, user_id: e.target.value })} />
          <input placeholder="Suggestion Text" value={suggestionForm.suggestion_text} onChange={(e) => setSuggestionForm({ ...suggestionForm, suggestion_text: e.target.value })} />
          <button onClick={createSuggestion}>Create Suggestion</button>
        </div>
        <div>
          <input placeholder="Update Suggestion ID" value={suggestionUpdateId} onChange={(e) => setSuggestionUpdateId(e.target.value)} />
          <input placeholder="User ID" value={suggestionUpdateData.user_id} onChange={(e) => setSuggestionUpdateData({ ...suggestionUpdateData, user_id: e.target.value })} />
          <input placeholder="Suggestion Text" value={suggestionUpdateData.suggestion_text} onChange={(e) => setSuggestionUpdateData({ ...suggestionUpdateData, suggestion_text: e.target.value })} />
          <button onClick={updateSuggestion}>Update Suggestion</button>
        </div>
        <ul>
          {suggestions.map((sug) => (
            <li key={sug._id}>
              {sug.suggestion_text} <button onClick={() => deleteSuggestion(sug._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      <hr />

      {/* USER PROFILE STATS SECTION */}
      <section>
        <h2>User Profile Stats</h2>
        <button onClick={fetchStats}>Fetch Stats</button>
        <div>
          <input placeholder="User ID" value={statsForm.user_id} onChange={(e) => setStatsForm({ ...statsForm, user_id: e.target.value })} />
          <input placeholder="XP" type="number" value={statsForm.xp} onChange={(e) => setStatsForm({ ...statsForm, xp: Number(e.target.value) })} />
          <input placeholder="Level" type="number" value={statsForm.level} onChange={(e) => setStatsForm({ ...statsForm, level: Number(e.target.value) })} />
          <input placeholder="Productivity Score" type="number" value={statsForm.productivity_score} onChange={(e) => setStatsForm({ ...statsForm, productivity_score: Number(e.target.value) })} />
          <button onClick={createStats}>Create Stats</button>
        </div>
        <div>
          <input placeholder="Update Stats ID" value={statsUpdateId} onChange={(e) => setStatsUpdateId(e.target.value)} />
          <input placeholder="User ID" value={statsUpdateData.user_id} onChange={(e) => setStatsUpdateData({ ...statsUpdateData, user_id: e.target.value })} />
          <input placeholder="XP" type="number" value={statsUpdateData.xp} onChange={(e) => setStatsUpdateData({ ...statsUpdateData, xp: Number(e.target.value) })} />
          <input placeholder="Level" type="number" value={statsUpdateData.level} onChange={(e) => setStatsUpdateData({ ...statsUpdateData, level: Number(e.target.value) })} />
          <input placeholder="Productivity Score" type="number" value={statsUpdateData.productivity_score} onChange={(e) => setStatsUpdateData({ ...statsUpdateData, productivity_score: Number(e.target.value) })} />
          <button onClick={updateStats}>Update Stats</button>
        </div>
        <ul>
          {stats.map((stat) => (
            <li key={stat._id}>
              User: {stat.user_id} - XP: {stat.xp} - Level: {stat.level} - Productivity: {stat.productivity_score} <button onClick={() => deleteStats(stat._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* PROTECTED DATA SECTION */}
      <section>
        <h2>Protected Data</h2>
        <button onClick={fetchProtectedData}>Fetch Protected Data</button>
        {protectedData && (
          <div>
            <h3>Protected Data Response:</h3>
            <pre>{JSON.stringify(protectedData, null, 2)}</pre>
          </div>
        )}
      </section>



    </div>
  );
};

export default TestingDB;
