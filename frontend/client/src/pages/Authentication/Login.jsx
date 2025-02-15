import { useState } from "react";
import { login } from "../../api";
import { useNavigate } from "react-router-dom";
import { Popper } from "@mui/base/Popper";
import { styled } from "@mui/system";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    setAnchorEl(event.currentTarget); // Show Popper

    try {
      await login(email, password);
      setMessage("Verification code sent to email.");
      setTimeout(() => {
        setAnchorEl(null);
        navigate("/verify");
      }, 3000);
    } catch (error) {
      setMessage("Login failed. Please check " );
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
          <h2>Sign In</h2>
          <div className="regform-input">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>

            {/* Popper Message */}
            <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top">
              <PopperMessage>{message}</PopperMessage>
            </Popper>
          </div>
          <hr />
          <div className="regbottom">
            <button onClick={() => navigate("/register")}>Signup</button>
            <p>Forgot password?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
