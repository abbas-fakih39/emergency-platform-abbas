const DB = require("./database").connectDB;
const express = require('express');
const app = express();

DB();

app.use(express.json())

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});