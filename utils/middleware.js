const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const unknowEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformated id' })
    } else if (error.name === 'No Content') {
        return response.status(400).send({ error: 'data already been deleted' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    logger.error(error.message)

    next(error)
}

module.exports = { requestLogger, unknowEndpoint, errorHandler }