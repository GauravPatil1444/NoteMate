import React from 'react'
import "./Notes.css"
import "./Notes-mobile.css"
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import trash from "../assets/trash.png"
import recycle from "../assets/recycle-bin.png" 
import cross from "../assets/cross.png"
import light_loader from "../assets/light_loader.png"
import dark_loader from "../assets/dark_loader.png"
import { auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const Notes = () => {

    const [Notes, setNotes] = useState([])
    const [addnote, setaddnote] = useState(false)
    const [titleinp, settitleinp] = useState("") 
    const [noteinp, setnoteinp] = useState("")
    const [showbtn, setshowbtn] = useState(false)
    const [takenote, settakenote] = useState(true)
    const [edit, setedit] = useState([false,0])
    const [deleted, setdeleted] = useState([])
    const [history, sethistory] = useState([])
    const [deleteview, setdeleteview] = useState(false)
    const [loader, setloader] = useState(true)
    const note = useRef()

    
    useEffect(() => {
      if(localStorage.getItem("status")=="true"){
        fetchdata();
      }
      else{
        window.location.href="/Login";
      }
    },[])

    const updatelist = (list) => {
      const reversedList = [...list].reverse();
      const titlelist = reversedList.map(note => note[0]);
      const notesarr = reversedList.map(note => note[1]);
      auth.onAuthStateChanged(async (user) => {
          await setDoc(doc(db, "Users", `${user.uid}/Notes/NoteMate_Notes`), {
              titles: titlelist,
              notes: notesarr
          }, { merge: true });
      });
  };

  const decrementlist = (list) => {
      const reversedList = [...list].reverse();
      const deltitlelist = reversedList.map(note => note[0]);
      const delnotesarr = reversedList.map(note => note[1]);
      auth.onAuthStateChanged(async (user) => {
          await setDoc(doc(db, "Users", `${user.uid}/Notes/NoteMate_Notes`), {
              deletednotes: delnotesarr,
              deletedtitles: deltitlelist
          }, { merge: true });
      });
  };

  const fetchdata = async () => {
    auth.onAuthStateChanged(async (user) => {
      const docref = doc(db, "Users", `${user.uid}/Notes/NoteMate_Notes`);
      const docsnap = await getDoc(docref);
      if (docsnap.exists()) {
        try {
          const notesdata = [];
          const deldata = [];
          for (let i = 0; i < docsnap.data().titles.length; i++) {
            notesdata.push([docsnap.data().titles[i], docsnap.data().notes[i]]);
          }
          for (let i = 0; i < docsnap.data().deletedtitles.length; i++) {
            deldata.push([docsnap.data().deletedtitles[i], docsnap.data().deletednotes[i]]);
          }
          setNotes(notesdata.reverse());
          setdeleted(deldata.reverse());
          setloader(false);
          }
        catch (error) {
          console.log(error.message);
          setloader(false);
        }
      } 
      else{
        console.log("No data in the database !");
        setloader(false);
      }
    });
  }

    useEffect(() => {
     console.log(Notes);
    }, [Notes])
    
    useEffect(() => {
      if(addnote && note.current){
        note.current.focus();
      }
    }, [addnote])

    const HandleAdd = () => {
      setloader(false)
      settakenote(true);
      if (titleinp !== "" || noteinp !== "") {
        const notelist = [[titleinp, noteinp], ...Notes];
        updatelist(notelist);
        setNotes(notelist);
        settitleinp("");
        setnoteinp("");
        setaddnote(false);
      } else {
        setaddnote(false);
      }
      if (edit[0]) {
        const noteList = [...Notes];
        noteList[edit[1]] = [titleinp, noteinp];
        setNotes(noteList);
        updatelist(noteList);
        settitleinp("");
        setnoteinp("");
        setaddnote(false);
        setedit([false, 0]);
      }
    }

    const HandleEdit = (note,i)=>{
      settakenote(false);
      setaddnote(true);
      setedit([true,i]);
      settitleinp(note[0]);
      setnoteinp(note[1]);
    }

    const HandleDelete = ()=>{
      settakenote(true);
      if(deleteview){
        const deletenote = [...deleted];
        deletenote.splice(edit[1],1);
        setdeleted(deletenote);
        decrementlist(deletenote);
        sethistory()
        settitleinp("");
        setnoteinp(""); 
        setaddnote(false);
        setedit(false);
      }
      else{
        const NoteList = [...Notes];
        const dellist = [...deleted];
        dellist.splice(0,0,[titleinp,noteinp])
        NoteList.splice(edit[1],1);
        setNotes(NoteList);
        updatelist(NoteList);
        deleted.length==0?decrementlist(dellist):decrementlist([...deleted,[titleinp,noteinp]]);
        deleted.length==0?setdeleted(dellist):setdeleted([...deleted,[titleinp,noteinp]]);
        history.map((hist)=>{
          hist[0]==edit[1] && ++edit[1]; 
        }) 
        sethistory([...history,[edit[1],[titleinp,noteinp]]])
        settitleinp("");
        setnoteinp(""); 
        setaddnote(false);
        setedit(false);
      }
    }

    const handlehist = (NoteList,hist,index,task)=>{
      NoteList.splice(hist[0],0,task);
      const histlist = [...history];
      histlist.splice(index,1);
      sethistory(histlist);
    }
  
    const handlerecycle = ()=>{
      const delNotelist = [...deleted];
      const NoteList = [...Notes];
      history.map((hist,index)=>{
        hist[1][0]==titleinp && handlehist(NoteList,hist,index,[titleinp,noteinp]);
        console.log(hist[1]) 
      })
      delNotelist.splice(edit[1], 1);
      setdeleted(delNotelist);
      decrementlist(delNotelist);
      setNotes(NoteList);
      updatelist(NoteList);
      settitleinp("");
      setnoteinp(""); 
      setaddnote(false);
      settakenote(true);
      setedit(false);
    }

  return (
    <div className='notes'>
       <div className="content">
       <div className="addnotecontainer">
          {!showbtn&&takenote&&<input id='takenote' type="text" placeholder='Take a note' onClick={()=>{setaddnote(true),settakenote(false)}} />}{addnote&&<div className='addnote' onMouseLeave={()=>{setaddnote(false),settakenote(true),setnoteinp(""),settitleinp(""),setedit(false)}}><div className='addnote-header'><><button id='addbtn' onClick={HandleAdd}>Done</button><div id='Notes-btns'>{edit[0] && <button onClick={()=>{HandleDelete();}} id='delbtn'><img src={trash} width={25} alt="couldn't load"/></button>} {deleteview&&edit[0] &&<button onClick={()=>{handlerecycle()}} id='rycbtn'><img src={recycle} width={25} alt="couldn't load"/></button>}</div></></div><textarea value={titleinp} onChange={(e)=>{settitleinp(e.target.value)}} type="text" id='title' className='noteinp' placeholder='Title'/><textarea  ref={note} onChange={(e)=>{setnoteinp(e.target.value)}} value={noteinp} type="text" id='note' className='noteinp' placeholder='Note'/></div>}
        </div>
        {showbtn&&takenote&&<div><p id='delheading'>Recycle bin</p></div>}
        {showbtn&&deleted.length==0&& <div><p id='delcontent'>No deleted content</p></div>}
        {takenote&&<div className="notecontainer">
          {loader&&<div id='loader'><img width={35} src={localStorage.getItem("mode")=="true"?dark_loader:light_loader} alt="couldn't"/></div>}
          {!showbtn?Notes.map((note,i)=>(
            <div key={i} onClick={()=>{HandleEdit(note,i)}} className='notelayout'><div className="title">{note[0]}</div><div className="note">{note[1]}</div></div>
            )):deleted.map((note,i)=>(
            <div key={i} onClick={()=>{HandleEdit(note,i)}} className='notelayout'><div className="title">{note[0]}</div><div className="note">{note[1]}</div></div>
            ))
          }
        </div>}
        {takenote&&<button onClick={()=>{setshowbtn(!showbtn),setdeleteview(!deleteview)}} className='showdeleted'>{showbtn?<img src={cross} alt="couldn't load" />:<img src={recycle} alt="couldn't load"/>}</button>}
        </div>

    </div>
  )
}
export default Notes
