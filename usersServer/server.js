const mongoose = require("mongoose")
const dotEnv = require("dotenv")
dotEnv.config({ path: `${__dirname}/config.env` })
const app = require(`${__dirname}/app`)

const DB = process.env.DATABASE
const port = process.env.PORT * 1

mongoose
    .connect(DB)
    .then(() => {
        console.log("DB connected")
    })

const server = app.listen(port, () => {
    console.log(`Users server is running on port:${port}`)
});