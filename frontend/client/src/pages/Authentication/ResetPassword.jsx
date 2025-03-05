import { useState } from "react";
import { resetPassword } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleResetPassword = async () => {
    try {
      const response = await resetPassword(email, newPassword);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input type="password" onChange={(e) => setNewPassword(e.target.value)} />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
