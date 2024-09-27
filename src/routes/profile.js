const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
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

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} profile updated successfully`,
            data: loggedInUser
        });
    } catch (error) {
        res.status(400).send("Error while editing profile " + error.message);
    }
});

module.exports = profileRouter;