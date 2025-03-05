import { useState } from "react";
import { forgotPassword } from "../../api"; // API call function
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setTimeout(() => navigate("/verify_reset_code", { state: { email } }), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Forgot Password?</h2>
      <p>Enter your email to receive a reset code.</p>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleForgotPassword}>Send Code</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
