import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
        <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/register_student'>Register</Link></li>
            <li><Link to='/login_student'>Login</Link></li>
        </ul>
    </div>
  )
}

export default Home