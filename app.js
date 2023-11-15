const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL)
    .then(() => logger.info('connect to MongoDB'))
    .catch((error) => {//error 为什么要用括号括起来
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

//处理不支持路由的程序应该放在倒数第二个
app.use(middleware.unknowEndpoint)
// 这必须是最后一个载入的中间件。
app.use(middleware.errorHandler)

module.exports = app