import React from 'react'
import { useForm } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import "./Login.css"
import "./Login-mobile.css"
import { auth,db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

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
          photo: "null"
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
            </form>
          </div>
        </>
      )
}

export default Create
