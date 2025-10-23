const express = require("express");
const notificationRouter = express.Router();
const { sendNotification, saveNotification } = require('../controller/push_notification');
const User = require("../models/user");
const Notification = require("../models/notification");
const auth = require("../middlewares/auth");


// send notification
notificationRouter.post("/send-notification", async (req, res) => {
    const { userId, title, message } = req.body;
    try {
        let user = await User.findById(userId);
        const tokenFCM = user.tokenFCM;
        if (user) {
            sendNotification(tokenFCM, title, message);
            saveNotification(userId, title, message);
        }
        res.status(200).send('Notification sent');
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// get notification
notificationRouter.get("/", async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: "64aedef510994c2f06d3650e" });
        res.status(200).json(notifications);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

notificationRouter.post("/seen-notification", auth, async (req, res) => {
    try {
        let notifications = await Notification.find({ userId: req.user });

        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].isSeen === false) {
                notifications[i].isSeen = true;
                await notifications[i].save();
            }
        }

        res.status(200).json(notifications);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = notificationRouter;