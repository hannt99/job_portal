import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDb from './src/configs/database.js';
import cors from 'cors';
import router from './src/routes/index.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 8888;
const __filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filePath);

// Connect database
connectDb();

// Middlewares
app.use(
    cors({
        origin: process.env.REACT_APP_BASE_URL,
        credentials: true,
    }),
);
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'uploads')));

// Set header
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8');
//     res.header('Access-Control-Allow-Origin', process.env.REACT_APP_BASE_URL);
//     res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes init
app.use('/api/v1', router);

// app.listen(port, () => console.log(`Server is running at port ${port}`));

// Socket.io
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: '*',
        origin: process.env.REACT_APP_BASE_URL,
    },
});

// Array to store connected users
let connectingUsers = [];

// Function to add a user to connectingUsers
const addConnectingUser = (userId, socketId) => {
    // Check if user already exists
    if (!connectingUsers.some((user) => user.userId === userId)) {
        connectingUsers.push({ userId, socketId });
    }
};

// Function to remove a user from connectingUsers
const removeConnectingUser = (socketId) => {
    connectingUsers = connectingUsers.filter((user) => user.socketId !== socketId);
};

// Function to get a user by userId
const getUser = (userId) => {
    return connectingUsers.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);

    // Event: addUser
    socket.on('addUser', (userId) => {
        addConnectingUser(userId, socket.id);
        io.emit('getUsers', connectingUsers); // Emit all connected users to all clients
    });

    // Event: sendNotification
    socket.on('sendNotification', ({ _id, receiverId, text, link, isRead }) => {
        // Find the receiving user in connectingUsers array
        const receiveUser = connectingUsers.find(item => item?.userId === receiverId);
    
        // Check if receiveUser is found before emitting notification
        if (receiveUser && receiveUser.socketId) {
            io.to(receiveUser.socketId).emit('getNotification', {
                receiverId,
            });
        } else {
            console.log(`User with userId ${receiverId} is not connected.`);
            // Optionally handle the case where user is not found or socketId is not available
        }
    });

    // Event: disconnect
    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected!`);
        removeConnectingUser(socket.id);
        io.emit('getUsers', connectingUsers); // Emit updated list of connected users to all clients
    });
});

server.listen(port, () => console.log(`Server is running at port ${port}`));