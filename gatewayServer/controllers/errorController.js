module.exports.errHandler = (err, req, res, next) => {
    if (err.isOperational === true) {
        res
            .status(err.statusCode)
            .json({
                status: 'failed',
                data: { message: err.message }
            })
    }
    else {
        console.error(err.stack);
        res
            .status(500)
            .json({
                status: 'Error',
                data: { message: 'Internal server Error' }
            })
    }
}