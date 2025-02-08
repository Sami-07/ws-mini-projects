import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
    console.log("Client connected");

    // setInterval(() => {
    //     socket.send("Hello there!");
    // }, 1000);

    socket.on("message", (message) => {
       console.log(`Received message: ${message}`);
       if (message.toString() === "ping") {
        socket.send(`pong`);
       }
    })


})


