// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
// const app = express();
// IMPORTS FROM OTHER FILES
const connection = require("./Utils/connection");

const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const twilioRouter = require("./routers/twilio-sms");
const notificationRouter = require("./routers/notification");

const socketIOEvents = require("./middlewares/socket");

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");

// INIT
dotenv.config();
let port = null;
let app = null;
let server = null;
let io = null;

const initVar = async () => {
    port = process.env.PORT;
    app = express();
    server = http.createServer(app);
    io = new Server(server);
    socketIOEvents(io);
}

const middleware = async () => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ extended: false }));

    app.use("/api/authentication", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/otp", twilioRouter);
    app.use("/api/notification", notificationRouter);
}


const ListenToPort = async () => {
    server.listen(port, async () => {
        console.log("Rest Api Port Connected " + port);
    });
}

// Connections
initVar().then(() => {
    ListenToPort().then(() => {
        middleware().then(() => {
            connection();
        })
    })
});












// mongoose
//     .connect(DB)
//     .then(() => {
//         console.log("Connection Successful");
//     })
//     .catch((e) => {
//         console.log(e);
//     });

// server.listen(3000, () => {
//     console.log(`connected at port ${PORT}`);
// });

// https://git.heroku.com/floating-wildwood-23496.git (origin)