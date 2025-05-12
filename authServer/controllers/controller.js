const bcrypt = require("bcrypt")
const crypto = require("crypto")
const JWT = require("jsonwebtoken")
const app = require("../../usersServer/app")
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const appError = require(`${__dirname}/../utils/appError`)
const { postJson } = require(`${__dirname}/../utils/httpClient`)
const Otp = require(`${__dirname}/../otpModel`)

const userServer = process.env.USERSERVICEURL
const emailServer = process.env.EMAILSERVICEURL
const jwtLoginSecrete = process.env.JWTLOGINSECRETE
const jwtSecrete = process.env.JWTSECRETE

module.exports.verifyCredentials = catchAsync(async (req, res, next) => {
    //get credentials
    const { email, phone, password } = req.body
    let authMethod = ''

    if (email) {
        authMethod = 'email'
    }
    else if (phone) {
        authMethod = 'phone'
    }
    else {
        throw new appError('Required Email or phone', 400)
        return
    }

    const response = await postJson(`${userServer}/users/credentials`, { email, phone })
    const credentialsStatus = response.status

    //if user not found
    if (credentialsStatus != 200) {
        let status = credentialsStatus === 404 ? 401 : credentialsStatus //avoid leaking what is invalid in credentials
        throw new appError(response.body.data.message, status)
        return
    }

    // if user found 
    const credentials = response.body.data.user
    //compare password
    const isCorrectPassword = await bcrypt.compare(password, credentials.password)

    if (!isCorrectPassword) {
        throw new appError(`Invalid credentials`, 401)
        return
    }
    credentials.password = null
    req.credentials = credentials
    req.authMethod = authMethod
    next()
})
module.exports.sendVerfication = catchAsync(async (req, res, next) => {
    const { authMethod, credentials } = req
    const { email, phone } = credentials

    //trigger otp(email or sms) return ok
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    Otp.create({ email, phone, otp: otpCode }) //store into DB
    //generate login token
    const accessToken = JWT.sign({ email }, jwtLoginSecrete, { expiresIn: '5m' })

    const emailResponse = await postJson(`${emailServer}/email/send-verification`, { email, token: accessToken, otp: otpCode })

    res.status(200).json({
        status: 'success',
        data: { message: `check your ${authMethod}` }
    })
})

module.exports.verifyLogin = catchAsync(async (req, res, next) => {
    //verfy user
    const { token } = req.body
    const payload = JWT.verify(token, jwtLoginSecrete)
    //get user data
    const user = await postJson(`${userServer}/users/lookup`, { email: payload.email })

    //generate jwt
    const refreshToken = JWT.sign({ email: user.email, role: user.role }, jwtSecrete, { expiresIn: '90d' })
    //send it to gateway
    res
        .status(200)
        .json({
            status: 'success',
            data: { token: refreshToken }
        })
})