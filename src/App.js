import React, { useRef, useState } from 'react';
import './App.css';
import firebase  from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore'; 

firebase.initializeApp({
  apiKey: "AIzaSyBK5znhv762NjLEb1JePb5iyALXGZfv9eI",
  authDomain: "superchat-a8ee2.firebaseapp.com",
  projectId: "superchat-a8ee2",
  storageBucket: "superchat-a8ee2.appspot.com",
  messagingSenderId: "146660695338",
  appId: "1:146660695338:web:5da00b5d874cc7d58a5253",
  measurementId: "G-296LDMT5XQ"

})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth); 
  return (
    <div className="App">
      <header className="App-header">
        <div className='emote'>&#x1F52F;🔥&#128231;</div>
        <div className='head'>
      
        SuperChat
        
        </div>
       <div >
       <SignOut/>
         </div>
       
      </header>

      <section>

          { user ? <Chatroom/> : <SignIn/>}
          
         </section>
    </div>
    
  );
}

function SignIn() {
 
  const signInWithGoogle = () => {
    
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }

  return(
    <button className='button_signin' onClick={signInWithGoogle}>Sign in with Google</button>
  )

}

function SignOut() {

  return auth.currentUser && (
    <button className='button2' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Chatroom() {
    
  const dummy  = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query,{idField : 'id'});

  const [formValue , setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const {uid , photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL


    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior : 'smooth'});

  }
  return (

    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message = {msg}/> )}

     <div ref={dummy}></div>

    </main>
    <form onSubmit={sendMessage}>
      <input placeholder = 'Type your text here'value={formValue} onChange={
        (e) => setFormValue(e.target.value)
      }/>
      <button type = 'submit'>Send</button>
    </form>
     </>



  )
}
function ChatMessage(props) {
  const { text , uid , photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received' ;

  return (
    
    <div className = {`message ${messageClass}`}>
      <img src = {photoURL}/>
    <p>{text}</p>
    </div>
    
  
  )
}
export default App;
