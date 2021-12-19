const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginData } = require('../../utils/validators.js');
const User = require('../../models/User.js');
const generateToken = require('../../utils/tokenGenerator')

module.exports = {  
    Query:{

    }, 
    Mutation:{
        register: async (_, {registerInput})=>{

            const { username, email, password, confirmPassword } = registerInput;

            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

            if(!valid){
                throw new UserInputError('Validation Error',{ errors }) 
            }
            const userExists = await User.findOne({username})

            if(userExists){
                throw new UserInputError('Username is already taken',{
                    errors: {
                        username: 'This username is already taken'
                    }
                }) 
            } 
            const hashedPass = await bcrypt.hash(password, 12);

            const newUser = {
                email,
                username,
                password: hashedPass,
                createdAt: new Date().toISOString()
            }
            
            const user = await User.create(newUser);

            const token = generateToken(user)

            return {
                id: user._id,
               ...user._doc,
                token
            }
 
        },

        login: async (_, { loginInput })=>{
            const { username, password } = loginInput;

            const { errors, valid } = validateLoginData(username, password);

            if(!valid){
                throw new UserInputError('Validation Error, Incomplete Fields',{ errors })
            }
            const user = await User.findOne({ username })
            
            if(!user){
                errors.general = 'User not found'
                throw new UserInputError('User not found',{ errors })
            }

            const passwordsMatch = await bcrypt.compare(password, user.password)

            if(!passwordsMatch){
                errors.general = 'Incorrect Credentials'
                throw new UserInputError('Incorrect Credentials',{ errors })
            }
            const token = generateToken(user);

            return {
                id: user._id,
               ...user._doc,
                token
            }

        }
    } 
}
