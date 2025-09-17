import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [form, setForm] = useState({name:"", email:"", password:""});
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if(res.ok){
                alert("Signup successful, Please login.")
                navigate("/login");
            }else {
                alert(data.msg || "Signup failed");
            }
        } catch(err){
            alert("Error : " + err.message);
        }
    };

    const gotoLogin = async (e) => {
        navigate("/login");
      };

    return (
        <div style={{ padding: "20px" }}>
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <br /><br />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <br /><br />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <br /><br />
            <button type="submit">Signup</button>
          </form><br />
          Already have an account? <button type="submit" onClick={gotoLogin}>Login</button>
        </div>
      );
}

export default Signup;