import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  function sendMessage(message: string) {
    socket?.send(message);
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);
    ws.onmessage = (event) => {
      alert(event.data);
    }
  }, [])

  return (
    <>
    {/* Type ping to get a message from the server */}
      <input type="text" placeholder="Enter  a message" onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => sendMessage(message)}>Send</button>
    </>
  )
}

export default App
