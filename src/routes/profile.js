const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
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

module.exports = profileRouter;