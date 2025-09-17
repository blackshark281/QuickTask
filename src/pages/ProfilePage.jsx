import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [name, setName] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch current user details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setName(data.name);
        } else {
          toast.error(data.msg || "Failed to load profile");
        }
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    };

    fetchProfile();
  }, [token]);

  // ✅ Update name
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser((prev) => ({ ...prev, name }));
        toast.success("Name updated successfully!");
      } else {
        toast.error(data.msg || "Name update failed");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  // ✅ Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

    //   console.log("password form : " + JSON.stringify(passwordForm));
    
      const data = await res.json();
    //   console.log("data : " + JSON.stringify(data));
      
    //   console.log("res : " + res.success);
      
      if (res.ok) {
        toast.success("Password updated successfully! Please login again.");
        localStorage.removeItem("token"); // logout
        setTimeout(() => {
            navigate("/login");
          }, 3000);
      } else {
        toast.error(data.msg || "Password update failed");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* User Info */}
      <p><strong>Email:</strong> {user.email}</p>

      {/* Update Name */}
      <form onSubmit={handleNameUpdate} style={{ marginTop: "20px" }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button type="submit" style={{ marginLeft: "10px" }}>Update Name</button>
      </form>

      {/* Update Password */}
      <form onSubmit={handlePasswordUpdate} style={{ marginTop: "30px" }}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Old Password"
          value={passwordForm.oldPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
          }
          required
          style={{ display: "block", margin: "10px 0" }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
          }
          required
          style={{ display: "block", margin: "10px 0" }}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={passwordForm.confirmNewPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
          }
          required
          style={{ display: "block", margin: "10px 0" }}
        />
        <button type="submit">Update Password</button>
        <Link to="/dashboard">Back to dashboard</Link>
      </form>
    </div>
  );
};

export default ProfilePage;
