import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        // Save token + user name
        localStorage.setItem("token", data.token);

        // fetch user profile to get name
        // const profileRes = await fetch("http://localhost:3000/api/users/profile", {
        //   headers: { Authorization: `Bearer ${data.token}` },
        // });
        // const profile = await profileRes.json();

        // localStorage.setItem("userName", profile.name);

        navigate("/dashboard");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const gotoSignup = async (e) => {
    navigate("/signup");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <br /><br />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <br /><br />
        <button type="submit">Login</button>
      </form><br />
      Create New Account <button type="submit" onClick={gotoSignup}>Signup</button>
    </div>
  );
}

export default Login;
