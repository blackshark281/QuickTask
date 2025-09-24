// import React, { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Dashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
//   const [editingTask, setEditingTask] = useState(null);

//   const navigate = useNavigate(); // new

//   // 🔹 New States for Filtering & Sorting
//   const [filter, setFilter] = useState("all"); // all | pending | in-progress | completed
//   const [sort, setSort] = useState("createdAt"); // createdAt | dueDate

//   const [overdueTasks, setOverdueTasks] = useState([]);
// const [todayTasks, setTodayTasks] = useState([]);

//   const token = localStorage.getItem("token");

//   const fetchTasks = useCallback(async () => {
//     const res = await fetch("http://localhost:3000/api/tasks", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();

//     // 🔹 NEW: if backend sends "Token is not valid"
//     if (data?.msg === "Token is not valid") {
//       localStorage.removeItem("token");
//       navigate("/login");
//       return;
//     }

//     setTasks(data);
  
//     if (res.ok) {
//       // ✅ Save all tasks
//       setTasks(data);
  
//       // ✅ Separate overdue and today tasks (ignore completed ones)
//       const overdue = data.filter(
//         (t) => t.isOverdue && t.status !== "completed"
//       );
  
//       const today = data.filter(
//         (t) =>
//           t.status !== "completed" &&
//           t.dueDate &&
//           new Date(t.dueDate).toDateString() === new Date().toDateString()
//       );
  
//       setOverdueTasks(overdue);
//       setTodayTasks(today);
//     } else {
//       toast.error(data.msg || "Error fetching tasks");
//     }
//   }, [token, navigate]);
  

//   // ✅ Fetch tasks on page load
//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ✅ Add new task
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost:3000/api/tasks", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       setForm({ title: "", description: "", dueDate: "" });
//       fetchTasks();
//       toast.success("Task added successfully!");
//     } else {
//       const data = await res.json();
//       toast.error(data.msg || "Task creation failed");
//     }
//   };

//   // ✅ Delete task
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (res.ok) {
//       fetchTasks();
//       toast.success("Task deleted successfully!");
//     } else toast.error("Error deleting task!");
//   };

//   // ✅ Edit task
//   const startEdit = (task) => {
//     setEditingTask(task);
//     setForm({
//       title: task.title,
//       description: task.description || "",
//       dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
//       status: task.status,
//     });
//   };

//   // ✅ Update task
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     const res = await fetch(
//       `http://localhost:3000/api/tasks/${editingTask._id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       }
//     );
//     if (res.ok) {
//       setEditingTask(null);
//       setForm({ title: "", description: "", dueDate: "" });
//       fetchTasks();
//       toast.success("Task updated!");
//     } else {
//       const data = await res.json();
//       toast.error(data.msg || "Update failed");
//     }
//   };

//   // ✅ Apply filter + sort
//   const getFilteredSortedTasks = () => {
//     let filtered = [...tasks];

//     if (filter !== "all") {
//       filtered = filtered.filter((t) => t.status === filter);
//     }

//     if (sort === "createdAt") {
//       filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     } else if (sort === "dueDate") {
//       filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
//     }

//     return filtered;
//   };

//   // ✅ Duplicate task
//   const duplicateTask = async (task) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:3000/api/tasks", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: task.title + " (Copy)",
//           description: task.description,
//           status: task.status,
//           dueDate: task.dueDate,
//         }),
//       });

//       if (res.ok) {
//         fetchTasks();
//         alert("Task duplicated successfully!");
//       } else {
//         const data = await res.json();
//         alert(data.msg || "Failed to duplicate task");
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
//     }
//   };

//   const displayedTasks = getFilteredSortedTasks();
//   // const overdue = tasks.filter((t) => t.isOverdue);
//   // const today = tasks.filter(
//   //   (t) =>
//   //     t.dueDate &&
//   //     new Date(t.dueDate).toDateString() === new Date().toDateString() &&
//   //     !t.isOverdue
//   // );

//   const buttonStyle = {
//     padding: "8px 14px",
//     borderRadius: "8px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "0.9rem",
//     fontWeight: "500",
//     transition: "all 0.25s ease",
//     color: "white",
//   };

//   const styles = {
//     add: { ...buttonStyle, background: "linear-gradient(135deg, #4cafef, #007bff)" },
//     edit: { ...buttonStyle, background: "linear-gradient(135deg, #ffb74d, #f57c00)" },
//     delete: { ...buttonStyle, background: "linear-gradient(135deg, #e57373, #d32f2f)" },
//     duplicate: { ...buttonStyle, background: "linear-gradient(135deg, #81c784, #388e3c)" },
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         padding: "20px",
//         background:
//           "linear-gradient(-45deg,rgb(198, 154, 255),rgb(196, 244, 250), #a18cd1,rgba(204, 251, 194, 0.66))",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         backgroundSize: "400% 400%",
//         animation: "gradientBG 15s ease infinite",
//       }}
//     >
//       <style>
//         {`
//           @keyframes gradientBG {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//           }
//         `}
//       </style>

//       {/* 🔹 Notification Banner */}
//       {overdueTasks.length > 0 && (
//         <div
//           style={{
//             background: "rgba(255, 0, 0, 0.8)",
//             color: "white",
//             padding: "10px 20px",
//             borderRadius: "8px",
//             marginBottom: "15px",
//             fontWeight: "bold",
//           }}
//         >
//           ⚠ You have {overdueTasks.length} overdue tasks!
//         </div>
//       )}

//       <h2 style={{ color: "white", marginBottom: "20px" }}>Dashboard</h2>
//       <nav style={{ marginBottom: "20px" }}>
//         <Link to="/profile">Profile</Link>
//       </nav>
//       <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} />

//       {/* 🔹 Filter + Sort */}
//       <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
//         <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="all">All</option>
//           <option value="pending">Pending</option>
//           <option value="in-progress">In Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//         <select value={sort} onChange={(e) => setSort(e.target.value)}>
//           <option value="createdAt">Sort by Created Date</option>
//           <option value="dueDate">Sort by Due Date</option>
//         </select>
//       </div>

//       {/* Add / Edit Task Form */}
//       <form
//         onSubmit={editingTask ? handleUpdate : handleSubmit}
//         style={{ marginBottom: "20px" }}
//       >
//         <input
//           type="text"
//           name="title"
//           placeholder="Task Title"
//           value={form.title}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//         />
//         <input
//           type="date"
//           name="dueDate"
//           value={form.dueDate}
//           onChange={handleChange}
//         />
//         {editingTask && (
//           <select name="status" value={form.status} onChange={handleChange}>
//             <option value="pending">Pending</option>
//             <option value="in-progress">In-Progress</option>
//             <option value="completed">Completed</option>
//           </select>
//         )}
//         <button style={styles.add} type="submit">
//           {editingTask ? "Update Task" : "Add Task"}
//         </button>
//       </form>

//       {/* 🔹 Main Content: Task list + Reminders Sidebar */}
//       <div style={{ display: "flex", gap: "20px", width: "100%" }}>
//         {/* Task List */}
//         <div style={{ flex: 3, display: "flex", flexWrap: "wrap", gap: "15px" }}>
//           {displayedTasks.length === 0 ? (
//             <p>No tasks found</p>
//           ) : (
//             displayedTasks.map((task) => (
//               <div
//                 key={task._id}
//                 style={{
//                   borderRadius: "12px",
//                   padding: "15px",
//                   width: "250px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   background: "rgba(255, 255, 255, 0.17)",
//                   boxShadow: "0 8px 20px rgba(8,15,30,0.18)",
//                   backdropFilter: "blur(8px) saturate(120%)",
//                   border: task.isOverdue && task.status !== "completed"
//                     ? "2px solid rgba(255,0,0,0.6)"
//                     : "1px solid rgba(255,255,255,0.12)",
//                   transition: "transform 180ms ease, box-shadow 180ms ease",
//                   cursor: "default",
//                 }}
//               >
//                 <div>
//                   <h3 style={{ margin: "0 0 8px 0", color: "inherit" }}>{task.title}</h3>
//                   <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
//                     <strong>Status:</strong> {task.status}
//                   </p>
//                   <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
//                     <strong>Due:</strong>{" "}
//                     {task.dueDate ? task.dueDate.split("T")[0] : "No due date"}
//                   </p>
//                   {task.isOverdue && task.status !== "completed" &&(
//                     <span style={{ color: "red", fontWeight: "bold" }}>⚠ Overdue</span>
//                   )}
//                   {task.description && (
//                     <p style={{ marginTop: "8px", color: "inherit" }}>{task.description}</p>
//                   )}
//                 </div>

//                 <div
//                   style={{
//                     marginTop: "12px",
//                     display: "flex",
//                     gap: "8px",
//                     justifyContent: "flex-end",
//                   }}
//                 >
//                   <button style={styles.edit} onClick={() => startEdit(task)}>
//                     Edit
//                   </button>
//                   <button style={styles.delete} onClick={() => handleDelete(task._id)}>
//                     Delete
//                   </button>
//                   <button style={styles.duplicate} onClick={() => duplicateTask(task)}>
//                     Duplicate
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Reminders Sidebar */}
//         <div
//           style={{
//             flex: 1,
//             padding: "15px",
//             background: "rgba(255,255,255,0.15)",
//             borderRadius: "12px",
//             backdropFilter: "blur(6px)",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//             color: "white",
//             maxHeight: "400px",
//             overflowY: "auto",
//           }}
//         >
//           <h3>Reminders</h3>
//           <div>
//             <h4>📅 Due Today</h4>
//             {todayTasks.length === 0 ? (
//               <p>No tasks due today</p>
//             ) : (
//               todayTasks.map((t) => <p key={t._id}>{t.title}</p>)
//             )}
//           </div>
//           <div>
//             <h4>⚠ Overdue</h4>
//             {overdueTasks.length === 0 ? (
//               <p>No overdue tasks</p>
//             ) : (
//               overdueTasks.map((t) => <p key={t._id}>{t.title}</p>)
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate(); // new

  // 🔹 NEW: States for collaborators
  const [showCollaboratorPopup, setShowCollaboratorPopup] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [collabEmail, setCollabEmail] = useState("");
  const [collabRole, setCollabRole] = useState("viewer");

  // 🔹 New States for Filtering & Sorting
  const [filter, setFilter] = useState("all"); // all | pending | in-progress | completed
  const [sort, setSort] = useState("createdAt"); // createdAt | dueDate

  const [overdueTasks, setOverdueTasks] = useState([]);
const [todayTasks, setTodayTasks] = useState([]);

  const token = localStorage.getItem("token");
  // console.log('token', localStorage.getItem('token'));


  // 🔹 Decode token payload to get userId
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      loggedInUserId = decoded.userId; 
    } catch (err) {
      console.error("Token decode failed:", err);
    }
  }


  const fetchTasks = useCallback(async () => {
    const res = await fetch("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    // 🔹 NEW: if backend sends "Token is not valid"
    if (data?.msg === "Token is not valid") {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    setTasks(data);
  
    if (res.ok) {
      // ✅ Save all tasks
      setTasks(data);
  
      // ✅ Separate overdue and today tasks (ignore completed ones)
      const overdue = data.filter(
        (t) => t.isOverdue && t.status !== "completed"
      );
  
      const today = data.filter(
        (t) =>
          t.status !== "completed" &&
          t.dueDate &&
          new Date(t.dueDate).toDateString() === new Date().toDateString()
      );
  
      setOverdueTasks(overdue);
      setTodayTasks(today);
    } else {
      toast.error(data.msg || "Error fetching tasks");
    }
  }, [token, navigate]);
  

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
      toast.error(data.msg || "Task creation failed");
    }
  };

  // ✅ Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchTasks();
      toast.success("Task deleted successfully!");
    } else toast.error("Error deleting task!");
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
  };

  // ✅ Update task
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:3000/api/tasks/${editingTask._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );
    if (res.ok) {
      setEditingTask(null);
      setForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
      toast.success("Task updated!");
    } else {
      const data = await res.json();
      toast.error(data.msg || "Update failed");
    }
  };

  // ✅ Apply filter + sort
  const getFilteredSortedTasks = () => {
    let filtered = [...tasks];

    if (filter !== "all") {
      filtered = filtered.filter((t) => t.status === filter);
    }

    if (sort === "createdAt") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "dueDate") {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return filtered;
  };

  // ✅ Duplicate task
  const duplicateTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title + " (Copy)",
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        }),
      });

      if (res.ok) {
        fetchTasks();
        alert("Task duplicated successfully!");
      } else {
        const data = await res.json();
        alert(data.msg || "Failed to duplicate task");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const displayedTasks = getFilteredSortedTasks();
  // const overdue = tasks.filter((t) => t.isOverdue);
  // const today = tasks.filter(
  //   (t) =>
  //     t.dueDate &&
  //     new Date(t.dueDate).toDateString() === new Date().toDateString() &&
  //     !t.isOverdue
  // );

  // 🔹 NEW: Handle Add Collaborator
  const handleAddCollaborator = async () => {
    if (!collabEmail) {
      toast.error("Email is required");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/tasks/${selectedTaskId}/collaborators`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: collabEmail, role: collabRole }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Collaborator added!");
        setShowCollaboratorPopup(false);
        setCollabEmail("");
        setCollabRole("viewer");
        fetchTasks();
      } else {
        toast.error(data.msg || "Failed to add collaborator");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  // 🔹 Update collaborator role
const handleUpdateCollaboratorRole = async (taskId, userId, newRole) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/tasks/${taskId}/collaborators/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Error updating role");
    }

    toast.success("Collaborator role updated!");
    fetchTasks(); // refresh tasks
  } catch (err) {
    console.error("Update collaborator failed:", err);
    toast.error(err.message);
  }
};

// 🔹 Delete collaborator
const handleDeleteCollaborator = async (taskId, userId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/tasks/${taskId}/collaborators/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Error deleting collaborator");
    }

    toast.success("Collaborator removed!");
    fetchTasks(); // refresh tasks
  } catch (err) {
    console.error("Delete collaborator failed:", err);
    toast.error(err.message);
  }
};


  const buttonStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.25s ease",
    color: "white",
  };

  const styles = {
    add: { ...buttonStyle, background: "linear-gradient(135deg, #4cafef, #007bff)" },
    edit: { ...buttonStyle, background: "linear-gradient(135deg, #ffb74d, #f57c00)" },
    delete: { ...buttonStyle, background: "linear-gradient(135deg, #e57373, #d32f2f)" },
    duplicate: { ...buttonStyle, background: "linear-gradient(135deg, #81c784, #388e3c)" },
    collaborator: { ...buttonStyle, background: "linear-gradient(135deg, #ab47bc, #6a1b9a)" }, // 🔹 NEW
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background:
          "linear-gradient(-45deg,rgb(198, 154, 255),rgb(196, 244, 250), #a18cd1,rgba(204, 251, 194, 0.66))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* 🔹 Notification Banner */}
      {overdueTasks.length > 0 && (
        <div
          style={{
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          ⚠ You have {overdueTasks.length} overdue tasks!
        </div>
      )}

      <h2 style={{ color: "white", marginBottom: "20px" }}>Dashboard</h2>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/profile">Profile</Link>
      </nav>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} />

      {/* 🔹 Filter + Sort */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt">Sort by Created Date</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
      </div>

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
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
        <button style={styles.add} type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* 🔹 Main Content: Task list + Reminders Sidebar */}
      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        {/* Task List */}
        <div style={{ flex: 3, display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {displayedTasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            displayedTasks.map((task) => (
              <div
                key={task._id}
                style={{
                  borderRadius: "12px",
                  padding: "15px",
                  width: "420px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "rgba(255, 255, 255, 0.17)",
                  boxShadow: "0 8px 20px rgba(8,15,30,0.18)",
                  backdropFilter: "blur(8px) saturate(120%)",
                  border: task.isOverdue && task.status !== "completed"
                    ? "2px solid rgba(255,0,0,0.6)"
                    : "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  cursor: "default",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "inherit" }}>{task.title}</h3>
                  <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
                    <strong>Status:</strong> {task.status}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>
                    <strong>Due:</strong>{" "}
                    {task.dueDate ? task.dueDate.split("T")[0] : "No due date"}
                  </p>
                  {task.isOverdue && task.status !== "completed" &&(
                    <span style={{ color: "red", fontWeight: "bold" }}>⚠ Overdue</span>
                  )}
                  {task.description && (
                    <p style={{ marginTop: "8px", color: "inherit" }}>{task.description}</p>
                  )}
                  {task.collaborators?.length > 0 && (
                  //   <p style={{ fontSize: "0.85rem" }}>
                  //     👥 {task.collaborators.map((c) => `(${c.role})`).join(", ")}
                  //   {/* 👥 {task.collaborators.map((c) => `${c.email} (${c.role})`).join(", ")} */}
                  // </p>
                  <div style={{ marginTop: "1rem" }}>
                    <h4>Collaborators</h4>
                    <ul>
                      {task.collaborators.map((c) => (
                        <li key={c.userId?._id} style={{ marginBottom: "0.5rem" }}>
                          <strong>{c.userId?.email || "Unknown"}</strong>
                        
                        {/* 🔹 Only owner can edit/delete collaborators */}
                        {String(task.userId?._id || task.userId) === String(loggedInUserId) && (
                          <>
                          {/* Role Dropdown */}
                          <select
                            value={c.role}
                            onChange={async (e) => {
                              try {
                                await handleUpdateCollaboratorRole(task._id, c.userId._id, e.target.value);
                                alert("Role updated!");
                                // fetchTaskDetails(); // refresh task details
                              } catch (err) {
                                alert("Failed to update role");
                              }
                            }}
                            style={{ marginLeft: "0.5rem" }}
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>

                          {/* Delete Button */}
                          <button
                            style={{ marginLeft: "0.5rem", color: "red" }}
                            onClick={async () => {
                              if (window.confirm("Remove this collaborator?")) {
                                try {
                                  await handleDeleteCollaborator(task._id, c.userId._id);
                                  alert("Collaborator removed!");
                                  // fetchTaskDetails();
                                } catch (err) {
                                  alert("Failed to remove collaborator");
                                }
                              }
                            }}
                          >
                            ❌ Remove
                          </button>
                          </>
                        )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button style={styles.edit} onClick={() => startEdit(task)}>
                    Edit
                  </button>
                  <button style={styles.delete} onClick={() => handleDelete(task._id)}>
                    Delete
                  </button>
                  <button style={styles.duplicate} onClick={() => duplicateTask(task)}>
                    Duplicate
                  </button>
                  {String(task.userId?._id || task.userId) === String(loggedInUserId) && (
                  <button
                    style={styles.collaborator}
                    onClick={() => {
                      setSelectedTaskId(task._id);
                      setShowCollaboratorPopup(true);
                    }}
                  >
                    Add Collaborator
                  </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reminders Sidebar */}
        <div
          style={{
            flex: 1,
            padding: "15px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "12px",
            backdropFilter: "blur(6px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            color: "white",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h3>Reminders</h3>
          <div>
            <h4>📅 Due Today</h4>
            {todayTasks.length === 0 ? (
              <p>No tasks due today</p>
            ) : (
              todayTasks.map((t) => <p key={t._id}>{t.title}</p>)
            )}
          </div>
          <div>
            <h4>⚠ Overdue</h4>
            {overdueTasks.length === 0 ? (
              <p>No overdue tasks</p>
            ) : (
              overdueTasks.map((t) => <p key={t._id}>{t.title}</p>)
            )}
          </div>
        </div>
        {showCollaboratorPopup && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3>Add Collaborator</h3>
            <input
              type="email"
              placeholder="Collaborator Email"
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
            />
            <select value={collabRole} onChange={(e) => setCollabRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button style={styles.collaborator} onClick={handleAddCollaborator}>
              OK
            </button>
            <button
              style={{ ...buttonStyle, background: "#aaa", color: "black" }}
              onClick={() => setShowCollaboratorPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;

