const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        unique: true,
        required: [true, 'User must have a name'],
        maxlenght: [6, "OTP can not be more than 6 digits"],
        minlenght: [6, "OTP can not be less than 6 digits"],
    },
    email: {
        type: String,
        lowercase: true,
    },
    phone: {
        type: String,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000),
        index: { expires: 0 }
    }
})

const Otp = new mongoose.model('otp', otpSchema)

module.exports = Otp