const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        next()
    } catch (err) {
        res.status(500).json({ msg: 'Invalid token', token: token })
    }
}

module.exports = jwtMiddleware

