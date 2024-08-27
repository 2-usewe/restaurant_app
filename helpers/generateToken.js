const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;  

const generateToken = (user) => {
  return jwt.sign(user, secretKey, { expiresIn: "1D" });
};

module.exports=generateToken;
