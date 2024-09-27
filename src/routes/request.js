const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestsRouter = express.Router();

requestsRouter.post("/sendConnection", userAuth, async (req, res) => {
    const user = req.user;
    res.send(`${user.firstName} send connection request`);
});

module.exports = requestsRouter;