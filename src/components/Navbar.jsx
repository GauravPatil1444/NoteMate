import React, { useState,useEffect } from 'react'
import "./Navbar.css"
import light from "../assets/light.png"
import dark from "../assets/dark.png"
import profileimg from "../assets/profileimg.png"
import headlineNotes from "../assets/headlineNotes.png"
import headlineTodo from "../assets/headlineTodo.png"
import cross from "../assets/cross.png"
import { auth } from '../firebase';
import { doc,getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const Navbar = ({headline,mode,setmode}) => {

  const [profile, setprofile] = useState(false)
  const [toggle, settoggle] = useState(false)

  useEffect(() => {
    profiledata();
  },[])
  
  const profiledata = async()=>{
    auth.onAuthStateChanged(async (user)=>{
      const docref = doc(db,"Users",user.uid);
      const docsnap = await getDoc(docref);
      if(docsnap.exists()){
        setprofile([docsnap.data().username,docsnap.data().email,docsnap.data().photo])
      }
      else{
        console.log("No data in the database !")
      }
    }) 
  }
  
  const logout = async ()=>{
    try{
      await auth.signOut();
      window.location.href = "/Login";
      localStorage.setItem("status",false);
    }
    catch(error){
      alert("Error signing out try again later");
    }
  }

  return (
    <div className='navbar'>
      <div className="logo-space">
        <div className="logo">NoteMate</div>
        <button onClick={()=>{setmode(!mode),localStorage.setItem("mode",!mode)}} className='theme'>{!mode?<img className='light' width={28} src={light} alt="couldn't load"/>:<img className='dark' width={28} src={dark} alt="couldn't load"/>}</button> 
      </div>
      <div className="headline">{headline}</div> 
      <div className="btns">
        <button className="btn" onClick={()=>{window.location.href = headline=="Todo"?"/":"/todo"}}>{headline=="Todo"?"Notes":"Todo"}{headline=="Todo"?<img className='headlineimg' width={24} src={headlineNotes} alt="couldn't load"/>:<img className='headlineimg' width={24} src={headlineTodo} alt="couldn't load"/>}</button>
        <button className='profilebtn'onClick={()=>{settoggle(!toggle)}}>{!toggle?<img className='profileimg' src={profileimg} width={35} alt="couldn't load"/>:<img className='profile' width={28} src={cross} alt="couldn't load"/>}</button>
      </div>
      {toggle && <div className='userprofile'>
        {profile[2]!=""&&<img className='profileimg' src={profile[2]} width={35} alt="couldn't load"/>}
        <div>Name: {profile[0]}</div>
        <div>email: {profile[1]}</div>
        <button onClick={()=>{logout();}}>Logout</button>
      </div>}
    </div>
  )
}

export default Navbar
