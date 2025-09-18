import { useState } from 'react'
import { Link } from "react-router-dom";
import "./navibar.css"
import { MdOutlineLightMode } from "react-icons/md";
import { MdNightlightRound } from "react-icons/md";
import { LuCircleUser } from "react-icons/lu";




function Navibar() {
  

  return (
    <div className="navibar">
        <Link>
            <div className="navibar-logo">
                <h1>MyApp</h1>
            </div>
        </Link>
        <div className="navibar-links">
            <ul>
                <li><Link to='/'> Home </Link></li>
                <li><Link to='/'> Doctors </Link></li>
                <li><Link to='/login'> Login </Link></li>
                <li><Link to='/'> About </Link></li>
            </ul>
        </div>
        <div className="navibar-icons">
            <div className='theam-icon'>
                <MdOutlineLightMode size={40} />
            </div>
            <div className='user-icon'>
                <LuCircleUser size={40} />
            </div>
        </div>
    </div>
  )
}

export default Navibar
