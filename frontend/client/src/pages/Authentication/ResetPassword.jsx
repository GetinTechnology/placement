import { useState } from "react";
import { resetPassword } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage("❌ Please enter a new password.");
      return;
    }

    try {
      await resetPassword(email, newPassword);
      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("❌ Failed to reset password. Try again.");
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        <p className="subtitle">Enter your new password below.</p>

        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>

        <button className="reset-password-btn" onClick={handleResetPassword}>
          Reset Password
        </button>

        {/* Message Box */}
        {message && <p className="message-box">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
