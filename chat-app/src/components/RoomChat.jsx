import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const RoomChat = () => {
  const { roomId, username } = useParams();
  const [messages, setMessages] = useState([]);
  const [roomMessage, setRoomMessage] = useState("");

  useEffect(() => {
    // Notify server that user joined the room
    socket.emit("joinRoom", { roomId, username });

    // Listen for messages in the room
    socket.on("message", (data) => {
      if (data.type === "room") {
        setMessages((prev) => [...prev, `${data.username}: ${data.message}`]);
      }
      if(data.type==="roomJoin"){
        setMessages((prev)=>[...prev, `User ${data.username} joined the room`]);
      }
    });

    return () => socket.off("message");
  }, [roomId, username]);

  const handleRoomMessage = () => {
    socket.emit("roomMessage", { roomId, username, message: roomMessage });
    setRoomMessage("");
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={roomMessage}
          onChange={(e) => setRoomMessage(e.target.value)}
        />
        <button onClick={handleRoomMessage}>Send</button>
      </div>
    </div>
  );
};

export default RoomChat;
