const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestsRouter = express.Router();

requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type " + status
            });
        }


        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({
                message: "User not found"
            });
        };

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection request already exists !!" })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });
        const data = await connectionRequest.save();
        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data,
        });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }

});

requestsRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { requestId, status } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Status not allowed !"
            });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found." })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: `Connection request ${status}`, data });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = requestsRouter;