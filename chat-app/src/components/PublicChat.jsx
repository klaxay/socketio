import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const PublicChat = () => {
  const [messages, setMessages] = useState([]);
  const [publicMessage, setPublicMessage] = useState("");
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("message", (data) => {
      if (data.type === "public") {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => socket.off("message");
  }, []);

  const handlePublicMessage = () => {
    socket.emit("publicMessage", publicMessage);
    setPublicMessage("");
  };

  const handleJoinRoom = () => {
    if (username && roomId) {
      navigate(`/room/${roomId}/${username}`);
    }
  };

  return (
    <div>
      <h1>Public Chat</h1>
      <div>
        <input
          type="text"
          placeholder="Type a public message"
          value={publicMessage}
          onChange={(e) => setPublicMessage(e.target.value)}
        />
        <button onClick={handlePublicMessage}>Send</button>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <hr />
      <div>
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default PublicChat;
