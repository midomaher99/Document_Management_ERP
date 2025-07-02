const dotEnv = require("dotenv")
dotEnv.config({ path: `${__dirname}/config.env` })
const mongoose = require('mongoose')
const app = require(`${__dirname}/app`)

const DB = process.env.DATABASE
const port = process.env.PORT * 1

mongoose
    .connect(DB)
    .then(() => {
        console.log("Auth DB connected")
    })
const server = app.listen(port, () => {
    console.log(`Auth Server is running on port:${port}`)
});