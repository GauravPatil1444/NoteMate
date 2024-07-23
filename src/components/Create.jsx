import React from 'react'
import { useForm } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import "./Login.css"
import "./Login-mobile.css"
import { auth,db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import google from "../assets/google.png"

const Create = () => {

  const handlecreate = async ()=>{
    try{
      await createUserWithEmailAndPassword(auth,getValues("email"),getValues("password"))
      const user = auth.currentUser;
      console.log(user);
      if(user){
        await setDoc(doc(db,"Users",user.uid),{
          email :user.email,
          username: getValues("username"),
          photo: "null",
          tasklist: [],
          deleted: []
        });
        localStorage.setItem("status",true);
        window.location.href="/"
      }
    }
    catch(error){
      console.log(error.message);
    }
    // console.log(email,password);
  }

  const googlesignin = async ()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth,provider).then(async(result)=>{
      if(result.user){
        const user = result.user;
        await setDoc(doc(db,"Users",user.uid),{
          email :user.email,
          username: user.displayName,
          photo: user.photoURL,
          tasklist: [],
          deleted: []
        });
       localStorage.setItem("status",true); 
       window.location.href="/"; 
      }
    });
  }

  const {
        register,
        getValues,
        handleSubmit,
        watch,
        formState: { errors,isSubmitting },
      } = useForm();
    
      const delay=(d)=>{
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            resolve()
          },d*1000)
        })
      }
      const onSubmit = async (data) =>{
        handlecreate();
        await delay(2)
      }
    
      return (
        <>
          <div className='form'>
            <p>NoteMate</p>
            <div id="formbackground">
            <form action=" " method="post" onSubmit={handleSubmit(onSubmit)}>
              <p>Create account</p>
              <input className='inp' type="text" placeholder='Username'{...register("username",{required:{value:true,message:"This field is required !"},minLength:{value:4,message:"Minimum length is 4"},maxLength:{value:20,message:"Maximum length is 10"}})}/>
              {errors.username && <div className='red'>{errors.username.message}</div>}
              <br />
              <input className='inp' type="email" placeholder='email'{...register("email",{required:{value:true,message:"This field is required !"}})}/>
              {errors.username && <div className='red'>{errors.username.message}</div>}
              <br />
              <input className='inp' type="password" placeholder='Password'{...register("password",{required:{value:true,message:"This field is required !"},minLength:{value:4,message:"Minimum length is 4"},maxLength:{value:10,message:"Maximum length is 10"}})}/>
              {errors.password && <div className='red'>{errors.password.message}</div>}
              <br />
              <input className='submitbtn' disabled={isSubmitting} type="submit" value="Create" />
                {isSubmitting && <div className='loader'>Loading...</div>}
              <div className="create-signin">Already has an account ! <a className='link' href="/Login">Login</a></div>  
              <div id='or'><div></div> OR <div></div></div>
              </form>
              <div className="formfooter">
                <button id='google' onClick={()=>{googlesignin();}}><img id='googleimg' src={google} alt="couldn't load"/><p id='googletxt'>Continue with Google</p></button>
              </div>             
            </div>
          </div>
        </>
      )
}

export default Create
