import { useState } from "react";
import { verifyCode } from "../../api";
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
  
const Verify = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
           const response =  await verifyCode(email, code);
           if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
            setMessage("Verification successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
           }
          
        } catch (error) {
            setMessage("Invalid code. Try again.");
        }
    };

    return (
        <div>
            <div className="top">
                <h2>GetinTestPortal</h2>
            </div>
            <div className="regform">
            <div className="reg">
            <h2>Verify Account</h2>
            <div className="regform-input">
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Verification Code" onChange={(e) => setCode(e.target.value)} />
            <button onClick={handleVerify}>Verify</button>
            </div>

          
            </div>

            </div>

        </div>
    );
};

export default Verify;
