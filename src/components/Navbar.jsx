import React from 'react'
import "./Navbar.css"
import { useState } from 'react'

const Navbar = ({headline}) => {

  return (
    <div className='navbar'>
      <div className="logo">NoteMate</div> 
      <div className="headline">{headline}</div> 
      <div className="btns">
        <button className="btn" onClick={()=>{window.location.href = headline=="Todo"?"/":"/todo"}}>{headline=="Todo"?"Notes":"Todo"}</button>
      </div>
    </div>
  )
}

export default Navbar
