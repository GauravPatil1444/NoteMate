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
  const [mode, setmode] = useState(false)

  useEffect(() => {
    console.log(tasklist);
  }, [tasklist])
  useEffect(() => {
    setmode(localStorage.getItem("mode")=="false"?false:true);
  },)
  
  
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
      element: <Login/>, 
    },
    {
      path: "/create",
      element: <Create/>,
    }

  ])

  return (
    <div className={mode?"app-dark":"app-light"}>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
