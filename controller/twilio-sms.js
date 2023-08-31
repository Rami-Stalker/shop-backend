// const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require('twilio')("AC45323bb22cc67034fdd6814ea47e5c56", "fadebe574a50d0e6e9ec2057d82c4b3f", {
    lazyLoading: true
})

const sendOTP = async (req, res) => {
    const {countryCode, phoneNumber } = req.body;
    try {
        const otpResponse = await client.verify
        .v2.services("VAc04dab9ef311c6eb88ca8a70336fb35a")
        .verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms",
        });
        res.status(200).send(`OTP send seccessfully: ${JSON.stringify(otpResponse)}`);
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}