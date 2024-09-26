const express = require("express");
const cookeParser = require("cookie-parser");

const User = require("./src/models/user");
const connectDB = require("./src/config/database");
const { userAuth } = require("./src/middlewares/auth");
const { validateSignUpDate } = require("./src/utils/validation");

const app = express();
const PORT = 3000;

app.use(cookeParser());
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

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const user = req.body;
    const ALLOWED_UPDATES = ["photoUrl", "password", "gender", "age", "skills"];
    const isUpdatedAllowed = Object.keys(user).every(k => ALLOWED_UPDATES.includes(k));

    if (!isUpdatedAllowed) {
        res.status(400).send("Update not alowed");
        return;
    }
    if (user?.skills?.length > 10) {
        res.status(400).send("Skills cannot be more than 10");
    }
    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, user, {
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
    // Validation of data
    try {
        validateSignUpDate(req);
        // Encrypt password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)

        // Save
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User added successfull..");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }

});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1 * 360000)
            });
            res.send("Login successful !!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("Profile not found");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Error while fetching user profile");
    }
});

app.post("/sendConnection", userAuth, async (req, res) => {
    const user = req.user;
    res.send(`${user.firstName} send connection request`);
});

connectDB().then(() => {
    console.log("Connected successfuly");
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}).catch(() => {
    console.log("Error while conecting DB.")
})