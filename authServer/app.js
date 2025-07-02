const express = require('express')
const controller = require(`${__dirname}/controllers/controller`)
const { errHandler } = require(`${__dirname}/controllers/errorController`)
const app = express()
app.use(express.json())
app.post('/auth/verify-credentials', controller.verifyCredentials, controller.sendVerfication)
app.post('/auth/verify-login', controller.verifyLogin)

app.use(errHandler)
module.exports = app