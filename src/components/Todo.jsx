import React, { useEffect, useState } from 'react'
import "./Todo.css"
import "./Container-mobile.css"
import trash from "../assets/trash.png"
import recycle from "../assets/recycle-bin.png" 
import editicon from "../assets/edit.png"
import cross from "../assets/cross.png"
import light_loader from "../assets/light_loader.png"
import dark_loader from "../assets/dark_loader.png"
import { auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const Todo = (props) => {

  const [inp, setinp] = useState("")
  const [deleted, setdeleted] = useState([])
  const [history, sethistory] = useState([])
  const [showbtn, setshowbtn] = useState(false)
  const [edit, setedit] = useState([false,0])
  const [addbtn, setaddbtn] = useState("Add task +")
  const [loader, setloader] = useState(true)

  useEffect(() => {
    if(localStorage.getItem("status")=="true"){
      fetchdata();
    }
    else{
      window.location.href="/Login";
    }
  },[])

  const updatelist = (list)=>{
    auth.onAuthStateChanged(async(user)=>{
      await setDoc(doc(db, "Users", user.uid), {
        tasklist: list,
      }, { merge: true });
    })
  }

  const decrementlist = (list)=>{
    auth.onAuthStateChanged(async(user)=>{
      await setDoc(doc(db, "Users", user.uid), {
        deleted: list,
      }, { merge: true });
    })
  }

  const fetchdata = async ()=>{
    auth.onAuthStateChanged(async (user)=>{
      const docref = doc(db,"Users",user.uid);
      const docsnap = await getDoc(docref);
      try{
        if(docsnap.exists()){
          console.log(docsnap.data());
          setdeleted(docsnap.data().deleted);
          props.settasklist(docsnap.data().tasklist);
          setloader(false);
        }
        else{
          console.log("No data in the database !")
          setloader(false);
        }
      }
      catch(error){
        console.log(error.message); 
      }
    }); 
  }
  
  const handleAdd = ()=>{
    const list = [...props.tasklist]
    if(edit[0]){
      list.splice(edit[1],1,inp);
      props.settasklist(list);
      updatelist(list);
      setedit([false,0])
      setinp("")
      setaddbtn("Add task +")
    }
    else{
      props.settasklist([...list,inp])
      setinp("")
      updatelist([...list,inp]);
    }
  }

  const handleDelete = (i,task) => {
    const newTasklist = [...props.tasklist];
    newTasklist.splice(i, 1);
    props.settasklist(newTasklist);
    updatelist(newTasklist);
    setdeleted([...deleted,task])
    decrementlist([...deleted,task]);
    history.map((hist)=>{
      hist[0]==i && ++i; 
    }) 
    sethistory([...history,[i,task]])
  }

  const handlehist = (Tasklist,hist,index,task)=>{
    Tasklist.splice(hist[0],0,task);
    const histlist = [...history];
    histlist.splice(index,1);
    sethistory(histlist);
  }

  const handlerecycle = (i,task)=>{
    const delTasklist = [...deleted];
    const Tasklist = [...props.tasklist];
    history.map((hist,index)=>{
      hist[1]==task && handlehist(Tasklist,hist,index,task);
      console.log(hist[1]) 
    })
    delTasklist.splice(i, 1);
    setdeleted(delTasklist);
    props.settasklist(Tasklist)
    decrementlist(delTasklist)
    updatelist(Tasklist)
  }

  const handleedit = (i,task)=>{
    setinp(task);
    setedit([true,i]); 
    setaddbtn("Done")
    console.log(task);
  }

  const permanentdel = (i)=>{
    const deletelist = [...deleted];
    deletelist.splice(i,1);
    setdeleted(deletelist);
    decrementlist(deletelist);
  }

  useEffect(() => {
    console.log("deleted :",deleted);
  }, [deleted])

  return (
    <div className='container'>
      <div className='heading'><h1>TODO</h1><h5 className='credit'>- By NoteMate</h5></div>
      <span className="inpsection">
        <input onChange={(e)=>{setinp(e.target.value)}} value={inp} type="text" className='inp' placeholder='Enter task'/>
        <button onClick={handleAdd} id='addbtn'>{addbtn}</button>
      </span>
      <div className='taskcontainer'>
        {loader&&<div id='loader'><img width={35} src={localStorage.getItem("mode")=="true"?dark_loader:light_loader} alt="couldn't"/></div>}
        {!showbtn?props.tasklist.map((task,i)=>(
          <div key={i} className='tasklayout'><span className='task'>{task}</span><button onClick={()=>{handleedit(i,task)}} className='edtbtn'><img src={editicon} width={25} alt="couldn't load"/></button><button onClick={()=>{handleDelete(i,task)}} className='delbtn'><img src={trash} width={25} alt="couldn't load"/></button></div>
        )):deleted.length==0?<div><h3 style={{backgroundColor : "transparent",color: "var(--element)"}}>No deleted content</h3></div>:deleted.map((task,i)=>(
          <div key={i} className='tasklayout'><span className='task'>{task}</span><button onClick={()=>{handlerecycle(i,task)}} className='rycbtn'><img src={recycle} width={25} alt="couldn't load"/></button><button onClick={()=>{permanentdel(i)}} className='delbtn'><img src={trash} width={25} alt="couldn't load"/></button></div>
        ))}    

      </div>
      <button onClick={()=>{setshowbtn(!showbtn)}} id='showdeleted'>{showbtn?<img src={cross} alt="couldn't load" />:<img src={recycle} alt="couldn't load"/>}</button>
    </div>
  )
}

export default Todo
