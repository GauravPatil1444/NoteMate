import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js';
import { auth, db } from '../firebase.js';
import './Login.css';
import './Login-mobile.css';

const Create = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          username: username,
          photo: 'null',
          tasklist: [],
          deleted: [],
        });
        localStorage.setItem('status', true);
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const validate = () => {
    const errors = {};
    if (!username) {
      errors.username = 'This field is required!';
    } else if (username.length < 4) {
      errors.username = 'Minimum length is 4';
    } else if (username.length > 20) {
      errors.username = 'Maximum length is 20';
    }

    if (!email) {
      errors.email = 'This field is required!';
    }

    if (!password) {
      errors.password = 'This field is required!';
    } else if (password.length < 4) {
      errors.password = 'Minimum length is 4';
    } else if (password.length > 10) {
      errors.password = 'Maximum length is 10';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      await handleCreate();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='form'>
        <p>NoteMate</p>
        <form onSubmit={handleSubmit}>
          <p>Create account</p>
          <input
            className='inp'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <div className='red'>{errors.username}</div>}
          <br />
          <input
            className='inp'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className='red'>{errors.email}</div>}
          <br />
          <input
            className='inp'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className='red'>{errors.password}</div>}
          <br />
          <input className='submitbtn' disabled={isSubmitting} type='submit' value='Create' />
          {isSubmitting && <div className='loader'>Loading...</div>}
          <div className='create-signin'>
            Already have an account? <a className='link' href='/Login'>Login</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
