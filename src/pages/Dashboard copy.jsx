import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");


  const fetchTasks = useCallback(async () => {
    const res = await fetch("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTasks(data);
    else alert(data.msg || "Error fetching tasks");
  }, [token]);

  // ✅ Fetch tasks on page load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
      toast.success("Task added successfully!");
    } else {
      const data = await res.json();
      alert(data.msg || "Task creation failed");
      toast.error("Error adding new task!");
    }
  };

  // ✅ Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok){
      fetchTasks();
      toast.success("Task deleted successfully!");
    }
    else toast.error("Error deleting task!");
  };

  // ✅ Edit task
  const startEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      status: task.status,
    });
    // toast.info("Task fetched!");
  };

  // ✅ Update task
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditingTask(null);
      setForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
      toast.success("Task updated!")
    } else {
      const data = await res.json();
      alert(data.msg || "Update failed");
      toast.error("Error updating task!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar = "false"/>

      {/* Add / Edit Task Form */}
      <form
        onSubmit={editingTask ? handleUpdate : handleSubmit}
        style={{ marginBottom: "20px" }}
      >
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        {editingTask && (
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Task Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "250px",
                background: "#f9f9f9",
                boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{task.title}</h3>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Due:</strong> {task.dueDate ? task.dueDate.split("T")[0] : "No due date"}</p>
              {task.description && <p>{task.description}</p>}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => startEdit(task)} style={{ marginRight: "10px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
