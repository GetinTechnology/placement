import { useState } from "react";
import axios from "axios";
import "./studentregister.css"; 
import Header from "../../components/Header";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/student_login/", {
        email,
        password,
      });

      localStorage.setItem("studentToken", response.data.token);
      setMessage(" Login successful!");
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed. Try again.");
    }
  };

  return (
    <>
    <Header/>
        <div className="login-container">
      <div className="login-card">
        <h2>Student Login</h2>
        <p>Access your test</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="message">{message}</p>
      </div>
    </div>
    </>
  
  );
};

export default StudentLogin;
