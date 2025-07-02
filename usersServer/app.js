const express = require('express')
const controller = require(`${__dirname}/controllers/controller`)
const { errHandler } = require(`${__dirname}/controllers/errorController`)
const app = express()
app.use(express.json())
app.post('/users/credentials', controller.findUserCredentials)
app.post('/users/lookup', controller.lookup)
app.use(errHandler)
module.exports = app