"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = new Map();
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
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
                });
            }
        }
    });
    socket.on("close", () => {
        allSockets.forEach((sockets, roomId) => {
            if (sockets.includes(socket)) {
                sockets.splice(sockets.indexOf(socket), 1);
            }
        });
    });
});
