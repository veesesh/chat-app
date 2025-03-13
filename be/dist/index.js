"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// wbsocket server
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message); // converts into js object
        //If the received message has type: "join", it means a user wants to join a specific room.
        if (parsedMessage.type == "join") {
            console.log("user joined room " + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
                username: parsedMessage.payload.username
            });
        }
        //If the received message has type: "chat", the user is sending a message to a room.
        // if (parsedMessage.type == "chat") {
        //     console.log("user wants to chat");
        //     // finding users room
        //     // const currentUserRoom = allSockets.find((x) => x.socket == socket).room
        //     let currentUserRoom = null;
        //     for (let i = 0; i < allSockets.length; i++) {
        //         if (allSockets[i].socket == socket) {
        //             currentUserRoom = allSockets[i].room
        //         }
        //     }
        //     // Broadcasting Message to Room Members
        //     for (let i = 0; i < allSockets.length; i++) {
        //         if (allSockets[i].room == currentUserRoom) {
        //             allSockets[i].socket.send(parsedMessage.payload.message)
        //         }
        //     }
        // }
        if (parsedMessage.type == "chat") {
            console.log("User wants to chat");
            let currentUser = allSockets.find((user) => user.socket === socket);
            if (!currentUser)
                return; // Safety check
            let currentUserRoom = currentUser.room;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == currentUserRoom) {
                    allSockets[i].socket.send(JSON.stringify({
                        sender: currentUser.username, // Include sender's name
                        text: parsedMessage.payload.message, // Original message
                    }));
                }
            }
        }
    });
});
