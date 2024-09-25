const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = 3000;

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Yuvraj",
        lastName: "Singh",
        emailId: "uv@abc.com",
        password: "test@1234"
    });
    try{
        await user.save();
        res.send("User added successfull..");
    }catch(err){
        res.status(400).send("Error while saving user.."+err.message);
    }
    
});

connectDB().then(() => {
    console.log("Connected successfuly");
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}).catch(() => {
    console.log("Error while conecting DB.")
})