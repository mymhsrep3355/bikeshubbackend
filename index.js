const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const requestLogger = require('./middlewares/requestLogger');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const adRoutes = require('./routes/adRoutes');
// const verifyToken = require('./middlewares/authMiddleware'); // Token verification middleware


dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();


app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ads', adRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Bikeshub API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
