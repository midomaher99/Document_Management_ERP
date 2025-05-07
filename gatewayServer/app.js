const express = require('express')
const controller = require(`${__dirname}/controller`)

const app = express()

app.use(express.json())

app.post('/api/auth/login', controller.login)

module.exports = app