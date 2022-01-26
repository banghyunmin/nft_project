const jwt = require('jsonwebtoken')
const config = require('../config/environment.js')

const verifyToken = (req, res, next) => {
    try {
	const clientToken = req.cookies.user
	const decoded = jwt.verify(clientToken, config.env.SECERET_KEY, function(err, decoded) {
		console.log(err)
	}
	)
	console.log(res.locals)

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
