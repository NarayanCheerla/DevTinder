const express = require("express");
const connectDB = require("./config/database");

const app = express();
const PORT = 3000;

app.use("/", (req, res) => {
    res.send("Server listening");
});

connectDB().then(() => {
    console.log("Connected successfuly");
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}).catch(() => {
    console.log("Error while conecting DB.")
})