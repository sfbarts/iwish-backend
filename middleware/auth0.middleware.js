const { auth } = require('express-oauth2-jwt-bearer')
const { AUTH_BASE_URL, AUTH_AUDIENCE } = require('../utils/config')

const validateAccessToken = auth({
  issuerBaseURL: AUTH_BASE_URL,
  audience: AUTH_AUDIENCE,
})

module.exports = {
  validateAccessToken,
}
