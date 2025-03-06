import { useState } from "react";
import { studentRegister } from "../../api"; // API call
import { useNavigate } from "react-router-dom";
import "./register.css";
import { Popper } from "@mui/base/Popper";
import { styled } from "@mui/system";
import axios from "axios";

const PopperMessage = styled("div")({
  background: "#333",
  color: "#fff",
  padding: "10px",
  borderRadius: "5px",
  fontSize: "14px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  transform: "translateY(-200px)",
  backgroundColor: "red",
});

function StudentRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    if (!checkbox) {
      setMessage("You must agree to the Terms & Conditions to register.");
      setAnchorEl(event.currentTarget);
      setTimeout(() => setAnchorEl(null), 3000);
      return;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/auth/register_student/",
            JSON.stringify({ email, password }),  // Convert to JSON
            {
              headers: {
                "Content-Type": "application/json", // Ensure correct header
              },
            }
          );

      // ✅ Registration successful - Navigate to verify screen
      setMessage("Registration successful! Please verify your email.");
      setAnchorEl(event.currentTarget);
      setTimeout(() => {
        setAnchorEl(null);
      }, 3000);
    } catch (error) {
      // ✅ Show meaningful error messages
      setMessage(error.response?.data?.error || "Registration failed. Try again.");
      setAnchorEl(event.currentTarget);
      setTimeout(() => setAnchorEl(null), 3000);
    }
  };

  return (
    <div>
      <div className="top">
        <h2>GetinTestPortal</h2>
      </div>
      <div className="regform">
        <div className="reg">
          <h2>Register</h2>
          <p>Easy way to register</p>
          <div className="regform-input">
            <label>Email address</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />

            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />

            <div className="regcheck">
              <input
                type="checkbox"
                checked={checkbox}
                onChange={(e) => setCheckbox(e.target.checked)}
              />
              <label>
                By signing up, I agree to Terms & Conditions and Privacy Policy.
              </label>
            </div>

            <button onClick={handleRegister}>Signup</button>

            {/* Popper Message */}
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top">
              <PopperMessage>{message}</PopperMessage>
            </Popper>
          </div>
        </div>
        <div className="reg2">
          <h3>Here to take a test?</h3>
          <p>No need to sign up. If you sign up, please sign in.</p>
        </div>
      </div>
    </div>
  );
}

export default StudentRegister;
