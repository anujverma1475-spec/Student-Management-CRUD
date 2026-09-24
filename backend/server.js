const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');

const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Student Management API is running");
});

app.use("/api/students", studentRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });