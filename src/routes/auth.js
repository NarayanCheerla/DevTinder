const bcrypt = require("bcrypt");
const express = require("express");

const User = require("../models/user");
const { validateSignUpDate } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpDate(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;