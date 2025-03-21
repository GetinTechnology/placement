import { useState } from "react";
import { verifyCode } from "../../api";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!email || !code) {
      setMessage("❌ Email and verification code are required.");
      return;
    }

    try {
      const response = await verifyCode(email, code);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setMessage("✅ Verification successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("❌ Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <h2>GetinTestPortal</h2>
        <p className="subtitle">Enter your email and verification code.</p>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            required
          />
        </div>

        <button className="verify-btn" onClick={handleVerify}>Verify</button>

        {/* Message Display */}
        {message && <p className="message-box">{message}</p>}
      </div>
    </div>
  );
};

export default Verify;
