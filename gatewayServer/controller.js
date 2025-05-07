const validator = require('validator')
const { parsePhoneNumberFromString, isValidNumber } = require('libphonenumber-js');

const catchAsync = require(`${__dirname}/catchAsync`)

module.exports.login = catchAsync(async (req, res, next) => {

    const authServerUrl = process.env.AUTHURL

    let { email, phone } = req.body
    const { password } = req.body

    let authMethod = ''
    let isValidCredentials = true
    //validate email or phone
    if (email) {
        console.log(email)
        authMethod = 'email'
        email = email.toLowerCase()
        if (!validator.isEmail(email)) {
            isValidCredentials = false
        }
        console.log({ email, isValidCredentials })
    } else if (phone) {
        authMethod = 'phone'
        const parsedPhone = parsePhoneNumberFromString(phone, 'EG');
        if (parsedPhone && parsedPhone.isValid()) {
            phone = parsedPhone.number
        } else {
            isValidCredentials = false
        }
    }

    if (!isValidCredentials) {
        res.status(401).json({
            status: 'failed',
            data: { message: `Invalid ${authMethod} or password` }
        })
        return
    }

    // communicate auth server to authenticate user
    const response = await fetch(`${authServerUrl}/auth/login/password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, phone, password })
    })

    const responseBody = await response.json()

    res
        .status(response.status)
        .json({
            responseBody
        })
})