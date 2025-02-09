import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<Record<string, string>[]>([])
  const [joined, setJoined] = useState(false)
  const [roomId, setRoomId] = useState('')
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    console.log(ws)
    setWebSocket(ws);

    ws.onmessage = (event) => {
      console.log("received message", event.data)
      setMessages((prevMessages) => [...prevMessages, { sender: JSON.parse(event.data).payload.sender, message: JSON.parse(event.data).payload.message }])
    }
  }, [])

  const handleSendMessage = () => {
    if (webSocket) {
      webSocket.send(JSON.stringify({
        type: 'CHAT',
        payload: {
          roomId: roomId,
          sender: name,
          message: message
        }
      }))
      setMessage('')
    }
  }

  return (
    <>
      {!joined && <div>
        <input type="text" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
        <button onClick={() => {
          if (webSocket) {
            webSocket.send(JSON.stringify({
              type: 'JOIN',
              payload: {
                roomId: 'room-red',

              }
            }))
            setJoined(true)
            setRoomId('room-red')
          }
        }}>Join Red Room</button>
      </div>}
      {joined && <div>
        <div>

          {messages.map((message, index) => (
            <div key={index}>{message.sender}: {message.message}</div>
          ))}
        </div>
        <input type="text" onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage()
          

          }
        }} />
        <button onClick={handleSendMessage}>Send</button>
      </div>}
    </>
  )
}

export default App
