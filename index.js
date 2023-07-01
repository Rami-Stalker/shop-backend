// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routers/admin");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const userRouter = require("./routers/user");

// INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB =
    "mongodb+srv://mohammedaldaly:moha242mmed9336@cluster0.dtkhlao.mongodb.net/";

// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});

// https://git.heroku.com/floating-wildwood-23496.git (origin)
