import React from 'react';
import logo from '../../images/logo (2).png';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import './menu.css'
function Menu({ toggleSidebar, isCollapsed }) {
  return (
    <div className="">
      <div className="menu-top">
        <img src={logo} alt="Logo" />
        <p className={`menu-title ${isCollapsed ? "hide-text" : ""}`}>Getin<span>Placement</span></p>
      </div>
      <div className="menu-body">
        <div>
        <ul>
          <li><WidgetsIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Test</span></li>
          <li><GroupIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Respondents</span></li>
          <li><InsertChartIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Result Database</span></li>
          <li><SettingsIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>My Account</span></li>
        </ul>
        </div>
        <div>
        <ul>
          <li><HelpCenterIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Help</span></li>
          <li><MeetingRoomIcon className="icon" /> <span className={isCollapsed ? "hide-text" : ""}>Sign Out</span></li>
          <li onClick={toggleSidebar}>
            <KeyboardDoubleArrowLeftIcon className="icon rotate-arrow" style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }} />
            <span className={isCollapsed ? "hide-text" : ""}>Hide</span>
          </li>
        </ul>
        </div>
      </div>
    </div>
  );
}

export default Menu;
