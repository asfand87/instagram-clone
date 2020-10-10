import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from "./firebase";
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  // this is for sign in modal.
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  // this is tracking user.
  const [user, setUser] = useState(null);

  // this is showing all the docs.
   useEffect(()=>{
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        post: doc.data(),
        id : doc.id,
      })));
    })
  },[]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user is logged in.
        console.log(authUser);
        setUser(authUser);
        
      }else {
        setUser(null);
      }
     
    })
    return ()=>{
      unsubscribe();
    }
    
  }, [user, username])


  // user Authentication.
  const singUp =(event)=>{
    event.preventDefault();
    
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser=>{
      authUser.user.updateProfile({
        displayName : username,
      })
    }))
    .catch(error=>alert(error.message))
    setOpen(false);
  }

  const signIn =(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message))
    setOpenSignIn(false);
  }


  return (
    <div className="app">

    
    

    <Modal
        open={open}
        onClose={()=>(setOpen(false))}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className = "app__signup">
      <center>
        <img
        className ="app__headerImage"
         src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
         alt=""/>
         </center>
         <Input
           placeholder ="username"
           type="text"
           value={username}
           onChange = {(event)=>setusername(event.target.value)}
         />
         <Input
           placeholder ="email"
           type="text"
           value={email}
           onChange = {(event)=>setEmail(event.target.value)}
         />
         <Input
           placeholder ="password"
           type="password"
           value={password}
           onChange = {(event)=>setPassword(event.target.value)}
         />
         <Button onClick={singUp}>Sing Up</Button>
         </form>
    </div>
      </Modal>

        {/* this modal is for sign in */}

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className = "app__signup">
      <center>
        <img
        className ="app__headerImage"
         src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
         alt=""/>
         </center>
         
         <Input
           placeholder ="email"
           type="text"
           value={email}
           onChange = {event=>setEmail(event.target.value)}
         />
         <Input
           placeholder ="password"
           type="password"
           value={password}
           onChange = {event=>setPassword(event.target.value)}
         />
         <Button onClick={signIn}>Sign In</Button>
         </form>
    </div>
      </Modal>

    
    


    <div className="app__header">
      <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
      {
      user?(
        <Button onClick={()=>auth.signOut()}>Sign Out</Button>
      ):(
        <div className="app__loginContainer">
        <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
      )}
    </div>

    <div className="app__posts">
    <div className="app__postsLeft">
    {
      posts.map(({id,post})=>
        <Post
          key = {id}
          postId = {id}
          username = {post.username}
          imageUrl = {post.imageUrl}
          caption = {post.caption}
          user = {user}
        />
      )
    }
    </div>
    <div className="app__postsRight">
    <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
    </div>
    </div>
  
    

    {user?.displayName ?(
      <ImageUpload username= {user.displayName}/>
    ):(
      <h3>Sorry you need to login!</h3>
    )}
    </div>
  );
}

export default App;
