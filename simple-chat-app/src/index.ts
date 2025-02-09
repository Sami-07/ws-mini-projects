import { WebSocketServer, WebSocket } from "ws";


const wss = new WebSocketServer({ port: 8080 });

let allSockets: Map<string, WebSocket[]> = new Map();
wss.on("connection", (socket) => {




    socket.on("message", (message) => {
        const parsedMessage: { type: string; payload: any } = JSON.parse(message.toString());
        if (parsedMessage.type === "JOIN") {
            console.log("user joined the room", parsedMessage.payload.roomId);
            allSockets.set(parsedMessage.payload.roomId, [...allSockets.get(parsedMessage.payload.roomId) || [], socket]);
        }

        if (parsedMessage.type === "CHAT") {
            const roomId = parsedMessage.payload.roomId;
            const message = parsedMessage.payload.message;
            const sender = parsedMessage.payload.sender;
            const checkIfTheUserIsInTheRoom = allSockets.get(roomId);
            if (checkIfTheUserIsInTheRoom) {
                checkIfTheUserIsInTheRoom.forEach((socket) => {
                    socket.send(JSON.stringify({ type: "CHAT", payload: { message, sender } }));
                })
            }

        }


    })


    socket.on("close", () => {
        allSockets.forEach((sockets, roomId) => {
            if (sockets.includes(socket)) {
                sockets.splice(sockets.indexOf(socket), 1);
            }
        })


    })

})


