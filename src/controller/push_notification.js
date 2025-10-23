const admin = require('firebase-admin');
const serviceAccount = require('../config/push_notification_key.json');
const Notification = require('../models/notification');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

function sendNotification(tokenFCM, title, body) {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: tokenFCM,
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent notification:', response);
        })
        .catch((error) => {
            console.log('Error sending notification:', error);
        });
}

async function saveNotification(userId, title, body) {

    let notification = new Notification({
        userId,
        notification: {
            title,
            body,
        },
    });
    notification = await notification.save();
}

module.exports = { sendNotification, saveNotification };