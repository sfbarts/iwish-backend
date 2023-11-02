const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response
      .status(400)
      .json({ error: 'Invalid Path for Category or Wishlist' })
  } else if (error.name === 'InvalidTokenError') {
    return response
      .status(400)
      .json({ error: 'Not Authorized - Log in to proceed with request' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler }
