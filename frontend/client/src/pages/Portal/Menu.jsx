import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo (2).png';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import './menu.css';
import { Link } from 'react-router-dom';

function Menu({ toggleSidebar, isCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");  // Get token from local storage

      if (!token) {
        alert("You are not logged in!");
        return;
      }

      const response = await fetch("http://localhost:8000/auth/logout/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");  // Remove token from storage
        alert("Logged out successfully!");
        navigate("/login");  // Redirect to login page
      } else {
        const data = await response.json();
        alert(data.message || "Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <div className="">
      <div className="menu-top">
        <img src={logo} alt="Logo" />
        <p className={`menu-title ${isCollapsed ? "hide-text" : ""}`}>
          Getin<span>Placement</span>
        </p>
      </div>
      <div className="menu-body">
        <div>
          <ul>
            <li><Link to='/portal'><WidgetsIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Test</span></Link></li>
            <li><Link to='/respondents'><GroupIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Respondents</span></Link></li>
            <li><Link to='/result_data_base'><InsertChartIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Result DataBase</span></Link></li>
            <li><Link to='/account'><SettingsIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>My Account</span></Link></li>
          </ul>
        </div>
        <div>
          <div className='menu-body-b'>
            <ul>
              <li><HelpCenterIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Help</span></li>
              <li onClick={handleLogout}><MeetingRoomIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Sign Out</span></li>
              <li onClick={toggleSidebar}>
                <KeyboardDoubleArrowLeftIcon className="icon rotate-arrow" style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }} />
                <span className={isCollapsed ? "hide-text" : ""}>Hide</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
