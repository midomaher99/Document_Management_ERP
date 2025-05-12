const validator = require('validator')
const JWT = require('jsonwebtoken')
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const appError = require(`${__dirname}/../utils/appError`)
const { postJson } = require(`./../utils/httpClient`)
const authServerUrl = process.env.AUTHURL

module.exports.validateCredentials = catchAsync(async (req, res, next) => {
    let { email, phone } = req.body

    let authMethod = ''
    let isValidCredentials = true

    //validate email or phone
    if (email) {
        authMethod = 'email'
        if (!validator.isEmail(email)) {
            isValidCredentials = false
        }
    }
    else if (phone) {
        authMethod = 'phone'
        const parsedPhone = parsePhoneNumberFromString(phone, 'EG');
        if (!(parsedPhone && parsedPhone.isValid())) {
            isValidCredentials = false
        }
    }
    else {//no email or phone in the body
        authMethod = 'email, phone'
        isValidCredentials = false
    }

    if (!isValidCredentials) {
        throw new appError(`Invalid ${authMethod} or password`, 401)
        return
    }
    next()
})

module.exports.requestVerification = catchAsync(async (req, res, next) => {
    let { email, phone } = req.body
    const { password } = req.body

    // communicate with auth server 
    const response = await postJson(`${authServerUrl}/auth/verify-credentials`, { email, phone, password })
    res
        .status(response.status)
        .json(response.body)
})

module.exports.verifyEmailLink = async (req, res, next) => {
    const tokenResponse = await postJson(`${authServerUrl}/auth/verify-login`, { token: req.params.token })
    if (tokenResponse.status != 200) {
        throw new appError(tokenResponse.status, tokenResponse.body.data.message)
        return
    }
    res.status(200).cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days 
    }).json({
        status: 'success',
        data: { message: 'Logged in successfully' }
    })
}
module.exports.verifyOtp = (req, res, next) => {

}