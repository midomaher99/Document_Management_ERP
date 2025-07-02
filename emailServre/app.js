const express = require('express')
const controller = require(`${__dirname}/controller`)
const app = express()
app.use(express.json())

app.post('/email/send-verification', controller.sendLoginVerification)

module.exports = app