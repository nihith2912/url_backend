const jwt = require('jsonwebtoken');
const secret = 'nihith@345567';

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, secret
);
}

function getUser(token) {
  try {
    if (!token) return null;
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
}

module.exports = {
    setUser,
    getUser,
}