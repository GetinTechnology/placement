import { useState } from "react";
import { verifyResetCode } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyReset() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerifyCode = async () => {
    try {
      const response = await verifyResetCode(email, code);
      setMessage(response.message);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid code.");
    }
  };

  return (
    <div>
      <h2>Enter Verification Code</h2>
      <input type="text" onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleVerifyCode}>Verify</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyReset;
