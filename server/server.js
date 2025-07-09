import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io'
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { log } from 'console';

// Create Express app server using HTYP server
const app = express();
const server = http.createServer(app);

// Init socket.io server
export const io = new Server( server, {
    cors : {origin: '*'}
})

// Store online users
export const userSocketMap = {}; // { userId: socketId } 

// Socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("Socket connected:", socket.id, "UserId:", userId);
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log("Current online users:", Object.keys(userSocketMap));
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // ✅ Handle message forwarding
    socket.on("sendMessage", ({ to, message }) => {
        const receiverSocketId = userSocketMap[to];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }
    });

    // ✅ Handle disconnection
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id, "UserId:", userId);
        delete userSocketMap[userId];
        console.log("Current online users after disconnect:", Object.keys(userSocketMap));
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


// Middleware setup
app.use(express.json({limit: '4mb'}));
app.use(cors());


// Routes setup
app.use('/api/status', (req, res)=> {
    res.send("Server is live");
})
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter)

// Connect to mongoDB
await connectDB()

if(process.env.NODE_ENV !== 'production'){

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log('Sever connected to port: ', PORT));

}

// Export server for Vercel
export default server;