import React from 'react'
import { useForm } from 'react-hook-form'
import "./Login.css"
import "./Login-mobile.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import google from "../assets/google.png"
import { setDoc,doc } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
    const {
        register,
        handleSubmit,
        getValues,
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
      const handlelogin = async ()=>{
        try{
          await signInWithEmailAndPassword(auth,getValues("email"),getValues("password"))
          console.log("Login successfull !");
          localStorage.setItem("status",true);
          window.location.href = "/";
        }
        catch(error){
          alert("user data not found");
          console.log(error.message);
        }
      }
      const googlesignin = async ()=>{
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async(result)=>{
          if(result.user){
            const user = result.user;
            await setDoc(doc(db,"Users",user.uid),{
              email :user.email,
              username: user.displayName,
              photo: user.photoURL
            });
           localStorage.setItem("status",true); 
           window.location.href="/"; 
          }
        });
      }
      const onSubmit = async () =>{
        handlelogin();
        await delay(2)
      }
    
      return (
        <>
          <div className='form'>
            <p>NoteMate</p>
            <form action=" " method="post" onSubmit={handleSubmit(onSubmit)}>
              <p>Login</p>
              <input className='inp' type="email" placeholder='email' {...register("email",{required:{value:true,message:"This field is required !"}})}/>
              {errors.email && <div className='red'>{errors.email.message}</div>}
              <br />
              <input className='inp' type="password" placeholder='Password' {...register("password",{required:{value:true,message:"This field is required !"},minLength:{value:4,message:"Minimum length is 4"},maxLength:{value:10,message:"Maximum length is 10"}})}/>
              {errors.password && <div className='red'>{errors.password.message}</div>}
              <br />
              <input className='submitbtn' disabled={isSubmitting} type="submit" value="Login" />
                {isSubmitting && <div className='loader'>Loading...</div>}
              <div className="create-signin">Don't have an account? <a className='link' href="/create">Create now</a></div>  
              <div id='or'><div></div> OR <div></div></div>
              <button id='google'><img onClick={()=>{googlesignin();}} id='googleimg' src={google} alt="couldn't load"/></button>
            </form>
          </div>
        </>
      )
}

export default Login
