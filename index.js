// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routers/auth");

// INIT
const app = express();
const DB = "mongodb+srv://mohammed:moha242@mmed9336@cluster0.zkwhbo4.mongodb.net/?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(authRouter);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`connected at port ${PORT}`);
});

module.exports = app;

// https://git.heroku.com/limitless-wildwood-40445.git (origin)
