const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

// get user info
userRouter.get("/info", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

// Save user token fcm
userRouter.post("/save-user-token-fcm", auth, async (req, res) => {
    try {
        let user = await User.findById(req.user);
        if (user) {
            user.tokenFCM = req.body.tokenFCM;
        }
        user = await user.save();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// update user data
userRouter.post("/modify-user-info", auth, async (req, res) => {
    try {
        const { address , name , phone } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user.name = name;
        user.phone = phone;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = userRouter;