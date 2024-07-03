import React from 'react'
import { useForm } from 'react-hook-form'
import "./Login.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

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
          alert("Login unsuccessful !")
          console.log(error.message);
        }
      }
      const onSubmit = async (data) =>{
        handlelogin();
        await delay(2)
      }
    
      return (
        <>
          <div className='form'>
            <p>Login</p>
            <form action=" " method="post" onSubmit={handleSubmit(onSubmit)}>
              <input className='inp' type="email" placeholder='email' {...register("email",{required:{value:true,message:"This field is required !"}})}/>
              {errors.email && <div className='red'>{errors.email.message}</div>}
              <br />
              <input className='inp' type="password" placeholder='Password' {...register("password",{required:{value:true,message:"This field is required !"},minLength:{value:4,message:"Minimum length is 4"},maxLength:{value:10,message:"Maximum length is 10"}})}/>
              {errors.password && <div className='red'>{errors.password.message}</div>}
              <br />
              <input className='submitbtn' disabled={isSubmitting} type="submit" value="Login" />
                {isSubmitting && <div className='loader'>Loading...</div>}
              <div className="create-signin">Haven't created account yet ? <a className='create-signin' href="/create">Create now</a></div>  
            </form>
          </div>
        </>
      )
}

export default Login
