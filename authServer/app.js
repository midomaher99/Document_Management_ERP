const express = require('express')
const controller = require(`${__dirname}/controller`)
const app = express()
app.use(express.json())
app.post('/auth/login/password', controller.login)

module.exports = app