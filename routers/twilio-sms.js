const express = require("express");
const twilioRouter = express.Router();

const { sendOTP , verifyOTP } = require('../');

twilioRouter.route('/send-otp').post(sendOTP);
twilioRouter.route('/verify-otp').post(verifyOTP);

module.exports = twilioRouter;