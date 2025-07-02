const express = require('express')
const authController = require(`${__dirname}/controllers/authController`)
const { errHandler } = require(`${__dirname}/controllers/errorController`)
const app = express()

app.use(express.json())

app.post('/api/auth/request-verification', authController.validateCredentials, authController.requestVerification)
app.get('/api/auth/verify-email-link/:token', authController.verifyEmailLink)
app.post('/api/auth/verify-otp', authController.verifyOtp)
app.use(errHandler)
module.exports = app