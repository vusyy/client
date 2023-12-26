import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { useLocation } from 'react-router-dom';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';



const socket = io('http://localhost:4000');

const Chat = () => {
  const location = useLocation();
  // const [chat, setChat] = useState(false)
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const ENDPOINT = 'localhost:4000';
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    // socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, ['http://localhost:4000', location.search]);

  useEffect(()=> {
    socket.on('resived-message', (messagee)=> {
      setMessages([...messages, messagee])
    })
    console.log(messages)
  },[messages, socket])
  
//   useEffect(() => {
//     socket.on('message', message => {
//       setMessages(messages => [ ...messages, message ]);
//     });
    
//     socket.on("roomData", ({ users }) => {
//       setUsers(users);
//       console.log(users)
//     });
// }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const MessageData = {
      message: message,
      user: name
    }
    if(!message == ''){
      socket.emit('send-message', MessageData);
    }else {
      alert('message can not be empty')
    }

    //   socket.on("roomData", ({ users }) => {
    //   setUsers(users);
    //   console.log(users)
    // });
    // if(message) {
    //   console.log(message)
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
    setMessage('')
  }

  return (
    <div className="outerContainer">
       <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
