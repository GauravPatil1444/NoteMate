import React, { useState } from 'react';
import './Login.css';
import './Login-mobile.css';
import google from '../assets/google.png';
import { auth, db } from '../firebase.js';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlelogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      localStorage.setItem('status', true);
      window.location.href = '/';
    } catch (error) {
      setError('Invalid email or password.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const googlesignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, 'Users', user.uid), {
        email: user.email,
        username: user.displayName,
        photo: user.photoURL,
        tasklist: [],
        deleted: [],
      });
      localStorage.setItem('status', true);
      window.location.href = '/';
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handlelogin();
  };

  return (
    <>
      <div className="form">
        <p>NoteMate</p>
        <form onSubmit={handleSubmit}>
          <p>Login</p>
          <input
            className="inp"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input
            className="inp"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <input className="submitbtn" type="submit" value="Login" disabled={loading} />
          {loading && <div className="loader">Loading...</div>}
          {error && <div className="red">{error}</div>}
          <div className="create-signin">
            Don't have an account? <a className="link" href="/create">Create now</a>
          </div>
          <div id="or">
            <div></div> OR <div></div>
          </div>
          <button id="google" type="button" onClick={googlesignin}>
            <img id="googleimg" src={google} alt="Google Logo" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
