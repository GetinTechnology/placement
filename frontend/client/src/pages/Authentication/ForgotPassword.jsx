import { useState } from "react";
import { forgotPassword } from "../../api";
import { useNavigate } from "react-router-dom";
import "./register.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("❌ Please enter your email.");
      return;
    }

    try {
      const response = await forgotPassword(email);
      setMessage("✅ Reset code sent! Check your email.");
      setTimeout(() => navigate("/verify_reset_code", { state: { email } }), 2000);
    } catch (error) {
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-card">
        <h2>Forgot Password?</h2>
        <p className="subtitle">Enter your email to receive a reset code.</p>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <button className="forgot-password-btn" onClick={handleForgotPassword}>
          Send Code
        </button>

        {/* Message Box */}
        {message && <p className="message-box">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
