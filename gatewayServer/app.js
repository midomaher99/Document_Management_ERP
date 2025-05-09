const express = require('express')
const controller = require(`${__dirname}/controller`)

const app = express()

app.use(express.json())

app.post('/api/auth/login', controller.login)
app.get('/api/auth/login-token/:token', controller.tokenLogin)
app.post('/api/auth/login-otp', controller.otpLogin)
module.exports = app