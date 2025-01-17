const express = require('express');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

// Middleware to parse JSON request body
app.use(express.json());


// Enable CORS
const cors = require('cors');
app.use(cors());


// Import Routes
// const authRoutes = require('./routes/authRoutes');


// Use Routes
// app.use("/api/auth", authRoutes);



// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is started at port ${process.env.PORT} successfully`);
});

const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('MongoDB Connected Successfully!');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit process with failure
    }
};
connect();


// Default route
app.get("/", (req, res) => {
    res.send(`<h1>This is HOMEPAGE</h1>`);
});

