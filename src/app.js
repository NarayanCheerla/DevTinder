const cors = require("cors");
const express = require("express");
const cookeParser = require("cookie-parser");

const connectDB = require("./config/database");

const PORT = 3000;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookeParser());
app.use(express.json());

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);


connectDB().then(() => {
    console.log("Connected successfuly");
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    })
}).catch(() => {
    console.log("Error while conecting DB.")
})