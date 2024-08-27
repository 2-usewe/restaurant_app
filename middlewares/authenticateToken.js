const jwt = require("jsonwebtoken");
const { responseCode } = require("../config/constants");
const tokenBlacklist = new Set();
const secretKey = process.env.JWT_SECRET_KEY;  

const blacklistToken = (token) => {
    tokenBlacklist.add(token);
};

const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};

const userAuthenticate = (req, res, next) => {
    // console.log("tokenmnnnn");
    const token = req.header("Authorization");
    if (!token || isTokenBlacklisted(token)) {
        return res.status(responseCode.UNAUTERIZED).json({status:responseCode.UNAUTERIZED, message: "Unauthorized: No token provided" }); // Unauthorized or blacklisted token
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            let statusCode;
            let message;

            switch (err.name) {
                case 'JsonWebTokenError':
                    statusCode = responseCode.UNAUTERIZED; 
                    message = "Invalid Token"; 
                    break;
                case 'TokenExpiredError':
                    statusCode = responseCode.UNAUTERIZED; 
                    message = "Token Expired"; 
                    break;
                case 'NotBeforeError':
                    statusCode = responseCode.UNAUTERIZED; 
                    message = "Token Not Active Yet"; 
                    break;
                default:
                    statusCode = responseCode.FORBIDDEN; 
                    message = "Token Verification Failed"; 
            }
            return res.status(statusCode).json({ 
                status:statusCode,
                message:message 
            });
        
        }
        req.user = user;
        next();
    });
};

module.exports = {
    blacklistToken,
    isTokenBlacklisted,
    userAuthenticate
}
