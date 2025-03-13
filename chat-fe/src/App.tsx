import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const inputRef = useRef();

  const generateRoomId = () => {
    setRoomId(Math.random().toString(36).substring(7));
  };

  const joinRoom = () => {
    if (!roomId.trim() || !username.trim()) return;
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((m) => [...m, data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId, username },
        })
      );
      setJoined(true);
    };

    wsRef.current = ws;
  };

  if (!joined) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl mb-4">Join a Chat Room</h1>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <button onClick={joinRoom} className="bg-blue-600 p-2 rounded">Join</button>
        <button onClick={generateRoomId} className="bg-green-600 p-2 mt-2 rounded">Create Room ID</button>
        {roomId && <p className="mt-2">Generated Room ID: {roomId}</p>}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'}`}>
            <span className={`p-2 rounded-lg ${message.sender === username ? 'bg-green-500' : 'bg-blue-600'}`}>
              <strong>{message.sender}: </strong>{message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 flex bg-gray-800">
        <input ref={inputRef} className="flex-1 p-2 bg-gray-700 rounded" placeholder="Type a message..." />
        <button
          onClick={() => {
            const message = inputRef.current?.value;
            if (message.trim()) {
              wsRef.current.send(JSON.stringify({ 
                type: "chat", 
                payload: { message, sender: username } 
              }));
              inputRef.current.value = "";
            }
          }}
          className="bg-purple-600 p-2 rounded ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;