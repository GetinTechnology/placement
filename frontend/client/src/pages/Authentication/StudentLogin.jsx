import { useState } from "react";
import { loginStudent } from "../../api";
import axios from "axios";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/student_login/',{email,password});
      localStorage.setItem("studentToken", response.data.token);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Invalid credentials.");
    }
  };

  return (
    <div>
      <h2>Student Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default StudentLogin;
