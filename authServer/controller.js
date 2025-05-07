const bcrypt = require("bcrypt")
const catchAsync = require(`${__dirname}/catchAsync`)

module.exports.login = catchAsync(async (req, res, next) => {
    //get credentials
    const userServer = process.env.USERSERVICEURL

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
            message: `Invalid ${authMethod} or password`
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
            message: `Invalid ${authMethod} or password`
        })
        return
    }
    //trigger otp(email or sms) return ok
    res.status(200).json({
        status: 'success',
        message: `check your ${authMethod}`
    })
})