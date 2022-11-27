const { config } = require('dotenv');

config()

module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    CONNECTION_URL: process.env.CONNECTION_URL
}