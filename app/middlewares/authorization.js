const jwt = require('jsonwebtoken')
const config = require('../config/environment')

const verifyToken = (req, res, next) => {
    try {
	const clientToken = req.cookies.user
	console.log("COOKIE :::: "+req.cookies)
	const decoded = jwt.verify(clientToken, config.env.SECERET_KEY)

	if(decoded) {
	    res.locals.userId = decoded.user_id
	    next()
	} else {
	    res.status(401).json({err: 'unauthorized'})
	}
    } catch(err) {
	console.log("Auth fail")
	res.status(401).json({err: 'token expired'})
    }
}
exports.verifyToken = verifyToken
