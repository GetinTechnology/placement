import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Authentication/Register";
import Login from "./pages/Authentication/Login";
import Verify from "./pages/Authentication/Verify";
import Home from "./pages/home/Home";
import Header from "./components/Header";
import Portal from "./pages/Portal/Portal";

function App() {
    return (
        <div className="App">
            <Router>
      
                <Routes>
                    <Route path="/portal" element={<Portal />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
            </Router>
        </div>

    );
}

export default App;
