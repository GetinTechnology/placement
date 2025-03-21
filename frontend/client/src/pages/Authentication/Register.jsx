import { useState } from "react";
import { register } from "../../api"; // API call
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!checkbox) {
      setMessage("❌ You must agree to the Terms & Conditions to register.");
      return;
    }

    try {
      await register(email, password);

      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/verify", { state: { email } });
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>GetinTestPortal</h2>
        <p className="subtitle">Create an account to start your journey!</p>

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
            placeholder="Enter a strong password"
            required
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={checkbox}
            onChange={(e) => setCheckbox(e.target.checked)}
          />
          <label>
            I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
          </label>
        </div>

        <button className="register-btn" onClick={handleRegister}>Sign Up</button>

        {/* Message Display */}
        {message && <p className="message-box">{message}</p>}

        <div className="login-redirect">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
