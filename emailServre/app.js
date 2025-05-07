const express = require('express')
const controller = require(`${__dirname}/controller`)
const app = express()
app.use(express.json())

app.post('/email/send-login-token', controller.sendLoginOtp)

module.exports = app