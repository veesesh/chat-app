import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white w-full">
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 w-full">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          >
            <span
              className={`px-4 py-2 rounded-lg max-w-xs text-white shadow-md ${
                index % 2 === 0
                  ? 'bg-blue-600'
                  : 'bg-green-500'
              }`}
            >
              {message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-900 p-4 flex items-center gap-2 border-t border-gray-700">
        <input
          ref={inputRef}
          id="message"
          className="flex-1 p-3 bg-gray-800 rounded-lg outline-none border border-gray-600 text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={() => {
            const message = inputRef.current?.value;
            if (message.trim()) {
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );
              inputRef.current.value = "";
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
