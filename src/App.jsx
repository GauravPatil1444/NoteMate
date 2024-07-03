import { useState,useEffect } from 'react'
import './App.css'
import Todo from './components/Todo'
import Login from './components/Login'
import Create from './components/Create'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Notes from './components/Notes'

function App() {
  const [tasklist, settasklist] = useState([])
  
  useEffect(() => {
    console.log(tasklist);
  }, [tasklist])
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar headline={"Notes"}/><Notes/></>,
    },
    {
      path: "/todo",
      element: <><Navbar headline={"Todo"}/><Todo tasklist={tasklist} settasklist={settasklist}/></>,
    },
    {
      path: "/Login",
      element: <Login/>, 
    },
    {
      path: "/create",
      element: <Create/>,
    }

  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
