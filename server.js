require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/dbConn");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Logging middleware (logs each request)
app.use(logger);

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/states", require("./routes/states"));

// 404

app.all("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Global error handler
app.use(errorHandler);

// Start server once DB is ready
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});