import { useState } from "react";
import { verifyResetCode } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";

function VerifyReset() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerifyCode = async () => {
    if (!code) {
      setMessage("❌ Please enter the verification code.");
      return;
    }

    try {
      await verifyResetCode(email, code);
      setMessage("✅ Code verified successfully! Redirecting...");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
    } catch (error) {
      setMessage("❌ Invalid code. Please try again.");
    }
  };

  return (
    <div className="verify-reset-wrapper">
      <div className="verify-reset-card">
        <h2>Verify Your Code</h2>
        <p className="subtitle">Enter the verification code sent to your email.</p>

        <div className="input-group">
          <label>Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            required
          />
        </div>

        <button className="verify-reset-btn" onClick={handleVerifyCode}>
          Verify Code
        </button>

        {/* Message Box */}
        {message && <p className="message-box">{message}</p>}
      </div>
    </div>
  );
}

export default VerifyReset;
