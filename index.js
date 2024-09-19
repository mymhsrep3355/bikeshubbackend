const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http'); 
const { Server } = require('socket.io'); 
const connectDB = require('./config/db');
const requestLogger = require('./middlewares/requestLogger');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const adRoutes = require('./routes/adRoutes');
const chatRoutes = require('./routes/chatRoutes'); 
const initializeWebSocket = require('./socket'); 

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app
const io = initializeWebSocket(server); // Initialize Socket.IO with the HTTP server

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Set up the routes
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/chats', chatRoutes); // Add chat routes

app.get('/', (req, res) => {
  res.send('Welcome to Bikeshub API');
});

// Start the server with the WebSocket functionality
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
