const express = require("express");
const twilioRouter = express.Router();

// const { sendOTP , verifyOTP } = require('../controller/twilio-sms');

// twilioRouter.route('/send-otp').post(sendOTP);
// twilioRouter.route('/verify-otp').post(verifyOTP);

// const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')("AC00e9dae94c99efeb6c7a8571cb62669c", "553807374b5516e31f75f8619712babe", {
    lazyLoading: true
})

twilioRouter.post("/send-otp", async (req, res) => {
    const { phoneCode, phoneNumber } = req.body;
    try {
        const otpResponse = await client.verify
            .v2.services("VAdb07625558d7c23fe57445379a76dc8d")
            .verifications.create({
                to: `+${phoneCode}${phoneNumber}`,
                channel: "sms",
            });
        res.status(200).send(`OTP send seccessfully: ${JSON.stringify(otpResponse)}`);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

twilioRouter.post("/verify-otp", async (req, res) => {
    const { phoneCode, phoneNumber, codeOTP } = req.body;
    try {
        const verifiedResponse = await client.verify
            .v2.services("VAdb07625558d7c23fe57445379a76dc8d")
            .verificationChecks.create({
                to: `+${phoneCode}${phoneNumber}`,
                code: codeOTP,
            });
        res.status(200).send(`OTP send seccessfully: ${JSON.stringify(verifiedResponse)}`);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = twilioRouter;