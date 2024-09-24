require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const initialConfig = require('./src/config/initialConfig');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const salesRoutes = require('./src/routes/salesRoutes');

// Create an Express application
const app = express();

// Middleware for parsing JSON body
app.use(bodyParser.json());
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
app.use(cors());

// Middleware for handling routes
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/sales', salesRoutes);

//Simple middleware to handle unexpected errors
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
})
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
})

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    const uri = 'mongodb+srv://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASS + '@' + process.env.MONGODB_DOMAIN + '/' + process.env.MONGODB_NAME;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
    initialConfig.createAdmin();
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas', error);
  }
});