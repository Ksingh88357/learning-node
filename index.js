const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require("./database/db");

// Configure dotenv
dotenv.config();

// Configure Express
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Enabling Cors
app.use(cors());

// Enable static path
app.use(express.static("images"));

app.get(`/`, (req, res) => res.send("Api Running"));

// Define Routes
const users = require("./routes/users");

app.use(`/api/users`, users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
