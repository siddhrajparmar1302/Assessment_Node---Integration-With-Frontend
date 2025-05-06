import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [username] = useState("User" + Math.floor(Math.random() * 1000));
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:10000"); 
    setSocket(newSocket);

    newSocket.on("loadMessages", (msgs) => setChat(msgs));
    newSocket.on("chatMessage", (msg) => setChat((prev) => [...prev, msg]));

    return () => newSocket.disconnect(); 
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("chatMessage", { username, message });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ border: "1px solid gray", height: 300, overflowY: "scroll", marginBottom: 10 }}>
        {chat.map((msg, i) => (
          <div key={i}><strong>{msg.username}</strong>: {msg.message}</div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
