const jwt = require('jsonwebtoken')

const { TOKEN_SECRET } = require('../config');

module.exports = ( user)=>{
    return jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, TOKEN_SECRET, { expiresIn:'1h'})
}