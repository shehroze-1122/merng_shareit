const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config')


module.exports = (context)=>{
    const authHeader = context.req.headers.authorization;

    if(authHeader){
        const token = authHeader.split('Bearer ')[1];

        if(token){
            try {
                const user = jwt.verify(token, TOKEN_SECRET)
                return user;
            } catch (error) {
                throw new AuthenticationError('Invalid or Expired token')
            }

        }else{
            throw new Error('Authentication token must be followed by Bearer i.e. Bearer <token>')
        }
    }else{
        throw new Error('Authorization header must be provided')
    }
}