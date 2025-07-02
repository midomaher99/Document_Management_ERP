const dotEnv = require("dotenv")
dotEnv.config({ path: `${__dirname}/config.env` })
const app = require(`${__dirname}/app`)


const port = process.env.PORT * 1

const server = app.listen(port, () => {
    console.log(`Gateway is running on port:${port}`)
});