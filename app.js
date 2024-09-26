const express = require("express");

const User = require("./models/user");
const connectDB = require("./config/database");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/user", async (req, res) => {
    const emailId = req.body.emailId;
    try {
        const users = await User.findOne({ emailId });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error while finding user .." + err.message);
    }
});

app.patch("/user", async (req, res) => {
    const user = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(user._id, user, {
            returnDocument: "after",
            runValidators: true
        });
        if (!updatedUser) {
            res.status(404).send("User not found");
        } else {
            res.send(updatedUser);
        }
    } catch (err) {
        res.status(400).send("Error while updating user .." + err.message);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send("User delted successfully");
        }

    } catch (err) {
        res.status(400).send("Error while deleting user .." + err.message);
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error while fetching all users .." + err.message);
    }
});

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfull..");
    } catch (err) {
        res.status(400).send("Error while saving user.." + err.message);
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