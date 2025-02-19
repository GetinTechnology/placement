import React, { useState } from 'react'
import Menu from '../Menu';



function Respontends() {
    const [isCollapsed, setIsCollapsed] =useState(false)
  return (
    <div className="portal">
    {/* Pass toggle function to Menu */}
    <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
      <Menu toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
    </div>
    <div className={`main ${isCollapsed ? "expanded" : ""}`}>
      <h1>Responds Content</h1>
    </div>
  </div>
  )
}

export default Respontends