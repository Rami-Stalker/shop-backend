// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routers/admin");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");

// INIT
const app = express();
const DB = 'mongodb+srv://mohammedramydaly:moha242mmed9336@cluster0.h2bdlvl.mongodb.net/?retryWrites=true&w=majority';

// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);

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

// https://git.heroku.com/floating-wildwood-23496.git (origin)
// https://git.heroku.com/evening-river-27258.git
