const User = require(`${__dirname}/../usersModel`)
const appError = require(`${__dirname}/../utils/appError`)
module.exports.findUserCredentials = async (req, res, next) => {
    //extract email or phone
    let { email, phone } = req.body
    //get email,phone, password from db
    let user = null
    let filterObj = {}
    if (email) {
        filterObj = { email }
    }
    else if (phone) {
        filterObj = { phone }
    }
    else {
        throw new appError('Required Email or phone', 400)
    }
    user = await User.findOne(filterObj).select('email password phone')
    //if not fount re with 404
    if (!user) {
        throw new appError('User not found', 404)
        return
    }
    res
        .status(200)
        .json(
            {
                status: 'success',
                data: { user }
            }
        )
}

module.exports.lookup = async (req, res, next) => {
    //body will be {email,phone}
    const { email, phone } = req.body
    let authMethod = ''
    let filterObj = {}
    if (email) {
        authMethod = 'email'
        filterObj = { email }
    } else if (phone) {
        authMethod = 'phone'
        filterObj = { phone }
    } else {
        //no email or phone
    }
    //get user 
    const user = await User.findOne(filterObj).select('email role')

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
}