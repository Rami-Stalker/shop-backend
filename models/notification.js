const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    userId: {
        required: true,
        type: String,
    },
    notification: {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        default: Date.now,
        type: Date,
    },
    isSeen: {
        default: false,
        type: Boolean,
    },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
