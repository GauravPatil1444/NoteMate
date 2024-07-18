import React, { useState, useEffect } from 'react';
import './App.css';
import Todo from './components/Todo';
import Login from './components/Login';
import Create from './components/Create';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Notes from './components/Notes';
// import Loader from './components/Loader'; // Import the Loader component

function App() {
  const [tasklist, settasklist] = useState([]);
  const [mode, setmode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State for loader

  useEffect(() => {
    console.log(tasklist);
  }, [tasklist]);

  useEffect(() => {
    setmode(localStorage.getItem("mode") === "false" ? false : true);
  }, []);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      console.log("ooh",isLoading);
      setIsLoading(false); // Hide loader after loading
    }, 100); // Adjust the timeout as needed
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar headline={"Notes"} mode={mode} setmode={setmode} /><Notes/></>,
    },
    {
      path: "/todo",
      element: <><Navbar headline={"Todo"} mode={mode} setmode={setmode}/><Todo tasklist={tasklist} settasklist={settasklist}/></>,
    },
    {
      path: "/Login",
      element: <Login isLoading={isLoading} setIsLoading={setIsLoading}/>, 
    },
    {
      path: "/create",
      element: <Create/>,
    }
  ]);

  if (isLoading) {
    return <div id='loading' style={{backgroundColor: "black"}}></div>; // Show loader during initial load
  }

  return (
    <div className={mode ? "app-dark" : "app-light"}>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
