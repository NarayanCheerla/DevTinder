const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "emailId"]);

        if (connectionRequest) {
            res.json({
                message: `Date fetched successfully`,
                data: connectionRequest,
            });
        }

    } catch (err) {
        res.status(400).json({ message: `Error : ${err.message}` });
    }
});

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName"]);
        res.json({
            message: "Connections fetched successfully",
            data: connectionRequest
        })
    } catch (err) {
        res.status(400).send({
            message: `ERROR : ${err.message}`
        })
    }
});

module.exports = userRouter;