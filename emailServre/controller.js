const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
    auth: null
});

module.exports.sendLoginVerification = async (req, res, next) => {
    const gatewayServer = process.env.GATEWAYSERVICEURL
    const { email, otp, token } = req.body;


    if (!email || !otp || !token) {
        res
            .status(400)
            .json({
                status: 'failed',
                data: { message: 'Email, OTP and login token are required.' }
            });
    }

    await transporter.sendMail({
        from: '"Auth Service" <no-reply@example.com>',
        to: email,
        subject: 'Your Login Token',
        text: `Your login OTP is: ${otp}, and your login token is: ${gatewayServer}/api/auth/verify-email-link/${token}`
    });

    res.status(200).json({ message: 'Email sent successfully' });


};