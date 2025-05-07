const User = require(`${__dirname}/usersModel`)

module.exports.getCredentials = async (req, res, next) => {
    //extract email or phone
    const { email, phone } = req.body
    //get email,phone, password from db
    let user = null
    if (email) {
        user = await User.findOne({ email }).select('email password phone')
    } else if (phone) {
        user = await User.findOne({ phone }).select('email password phone')
    }
    //if not fount re with 404
    if (!user) {
        res
            .status(404)
            .json(
                {
                    status: 'failed',
                    data: { message: 'User not found' }
                }
            )
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