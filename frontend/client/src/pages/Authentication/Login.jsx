import { useState } from "react";
import { login } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("❌ Email and Password are required.");
      return;
    }

    try {
      const response = await login(email, password);
      if (response) {
        localStorage.setItem("authToken", response.data.token);
        setMessage("✅ Login Successful! Redirecting...");
        setTimeout(() => navigate("/portal"), 2000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>GetinTestPortal</h2>
        <p className="subtitle">Welcome back! Please sign in to continue.</p>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>Login</button>

        {/* Message Display */}
        {message && <p className="message-box">{message}</p>}

        <div className="extra-links">
          <p><Link to="/forgot_password">Forgot password?</Link></p>
          <p>New here? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
