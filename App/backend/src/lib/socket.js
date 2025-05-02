import { Server } from "socket.io";
import http from "http";
import e from "express";

const app = e();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ["http://localhost:5173"] }
})
// this is used to store current online users
const onlineUserSocketMap = {}; // {userId : socketId}

//get the socketId of a user.
const getUsersSocketId = (userId) =>  onlineUserSocketMap[userId];


io.on("connection", (socket) => {
    
    //getting userId fron query params in handshake object.
    const userId = socket.handshake.query.userId;
    // if a userId is provided add the user to onlineUserSocketMap using in array style.
    if(userId) onlineUserSocketMap[userId] = socket.id;
    //io.emit is used to send events to all connected users
    io.emit("getOnlineUsers", Object.keys(onlineUserSocketMap)) 
    
    socket.on("disconnect", () => {
        delete onlineUserSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUserSocketMap))
    })
})


export { io, app, server, getUsersSocketId }