const express = require("express");

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "emailId", "photoUrl", "age", "gender", "about"];

userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

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
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map(row => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            message: "Connections fetched successfully",
            data
        })
    } catch (err) {
        res.status(400).send({
            message: `ERROR : ${err.message}`
        })
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const connectRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select(["fromUserId", "toUserId"]);

        const hideUsersFromFeed = new Set();
        connectRequests.forEach(req => {
            hideUsersFromFeed.add(req.toUserId.toString());
            hideUsersFromFeed.add(req.fromUserId.toString());
        });

        const users = await User.find({
            $and: [
                {
                    _id: {
                        $nin: Array.from(hideUsersFromFeed)
                    }
                },
                {
                    _id: {
                        $ne: loggedInUser._id
                    }
                }
            ]
        }).select(USER_SAFE_DATA).skip((page - 1) * limit).limit(limit);

        res.send(users);


    } catch (error) {
        res.status(400).json({
            message: `ERROR : ${error.message}`
        });
    }
})

module.exports = userRouter;