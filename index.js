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
const server = http.createServer(app); 
const io = initializeWebSocket(server); 


connectDB();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/chats', chatRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to Bikeshub Backend');
});

app.get('/sever', (req, res) =>{
  res.send('Server is up and running');
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
