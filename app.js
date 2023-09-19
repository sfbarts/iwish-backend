const express = require('express')

const app = express()

app.get('/demo', (request, response) => {
  response.send('Hello World')
})

module.exports = app
