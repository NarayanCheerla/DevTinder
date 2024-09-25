const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use("/", (req, res) => {
    res.send("Server listening");
})
mongoose.connect("mongodb://localhost:27017/").then(() => {
    console.log("Connected successfuly");
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}).catch(() => {
    console.log("Error while conecting DB.")
})