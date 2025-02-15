import React from 'react'
import Logo from '../images/logo (2).png'
import './components.css'
function Header() {
  return (
    <div className='header'>
        <div className='header-top'>
            <img src={Logo} alt="getinlogo" />
            <h2>Getin <span>Placements</span></h2>
        </div>
        <div className='header-bottom'>
        <button>Login</button>
        <button>Signup</button>
        </div>
    </div>
  )
}

export default Header