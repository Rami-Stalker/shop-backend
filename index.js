// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
// const app = express();
// IMPORTS FROM OTHER FILES
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const twilioRouter = require("./routers/twilio-sms");
const notificationRouter = require("./routers/notification");

const socketIOEvents = require("./middlewares/socket");

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// INIT
const PORT = 3000;
const DB =
    "mongodb+srv://mohammedaldaly:moha242mmed9336@cluster0.dtkhlao.mongodb.net/test";

// middleware
app.use(express.json());
app.use("/api/authentication", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/otp", twilioRouter);
app.use("/api/notification", notificationRouter);

// Socket Io
socketIOEvents(io);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });

server.listen(3000, () => {
    console.log(`connected at port ${PORT}`);
});

// https://git.heroku.com/floating-wildwood-23496.git (origin)