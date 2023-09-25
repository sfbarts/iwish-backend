require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI
const AUTH_BASE_URL = `https://${process.env.AUTH0_DOMAIN}`
const AUTH_AUDIENCE = process.env.AUTH0_AUDIENCE
module.exports = {
  PORT,
  MONGO_URI,
  AUTH_BASE_URL,
  AUTH_AUDIENCE,
}
