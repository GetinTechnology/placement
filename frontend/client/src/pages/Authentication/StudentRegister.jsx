import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./studentregister.css";
import Header from "../../components/Header";

function StudentRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!checkbox) {
      showMessage("❌ You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register_student/",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      showMessage("✅ Registration successful! Verify your email.");
      setTimeout(() => navigate("/login_student"), 3000);
    } catch (error) {
      showMessage(error.response?.data?.error || "❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
  };

  return (
    <>
    <Header/>
     <div className="register-container">
         

         <div className="register-box">
           <h2>Sign Up</h2>
           <p>Create an account to start your test journey!</p>
   
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
   
           <div className="terms">
             <input
               type="checkbox"
               checked={checkbox}
               onChange={(e) => setCheckbox(e.target.checked)}
             />
             <label className="terms_conditions">I agree to the Terms & Conditions and Privacy Policy.</label>
           </div>
   
           <button className="register-btn" onClick={handleRegister} disabled={loading}>
             {loading ? "Signing Up..." : "Sign Up"}
           </button>
   
           <p className="message">{message}</p>
   
           <div className="signin-redirect">
             <p>Already have an account? <a href="/login_student">Sign In</a></p>
           </div>
         </div>
       </div>
    </>
   
  );
}

export default StudentRegister;
