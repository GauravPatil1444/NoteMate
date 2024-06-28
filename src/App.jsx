import { useState,useEffect } from 'react'
import './App.css'
import Container from './components/Container'

function App() {
  const [tasklist, settasklist] = useState([])
  useEffect(() => {
    console.log(tasklist);
  }, [tasklist])


  return (
    <>
      <div className='heading'>
        <h1>TODO</h1>
        <h5 className='credit'>- By NoteMate</h5>
      </div>
      <Container tasklist={tasklist} settasklist={settasklist}/>
    </>
  )
}

export default App
