const bcrypt = require("bcrypt")
const crypto = require("crypto")
const JWT = require("jsonwebtoken")
const catchAsync = require(`${__dirname}/catchAsync`)
const Otp = require(`${__dirname}/otpModel`)

module.exports.login = catchAsync(async (req, res, next) => {
    //get credentials
    const userServer = process.env.USERSERVICEURL
    const emailServer = process.env.EMAILSERVICEURL
    const jwtLoginSecrete = process.env.JWTLOGINSECRETE
    const { email, phone, password } = req.body
    let authMethod = ''

    if (email) {
        authMethod = 'email'
    }
    else if (phone) {
        authMethod = 'phone'
    }
    const credentialsResponse = await fetch(`${userServer}/users/auth-credentials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, phone }),
    })
    const parsedResponse = await credentialsResponse.json()
    //if user not found
    if (parsedResponse.status === 'failed') {
        res.status(401).json({
            status: 'failed',
            data: { message: `Invalid ${authMethod} or password no record` }
        })
        return
    }
    // if user found 
    //compare password
    const credentials = parsedResponse.data.user
    const isCorrectPassword = await bcrypt.compare(password, credentials.password)
    if (!isCorrectPassword) {
        res.status(401).json({
            status: 'failed',
            data: { message: `Invalid ${authMethod} or password password` }
        })
        return
    }
    //trigger otp(email or sms) return ok
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    Otp.create({ email, phone, otp: otpCode }) //store into DB
    //generate login token
    const logeinToken = JWT.sign({ email }, jwtLoginSecrete, { expiresIn: '5m' })

    const emailResponse = await fetch(`${emailServer}/email/send-login-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token: logeinToken, otp: otpCode })
    })

    res.status(200).json({
        status: 'success',
        data: { message: `check your ${authMethod}` }
    })
})