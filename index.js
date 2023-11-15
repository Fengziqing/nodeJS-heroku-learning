require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end
            }
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {//暂时没有这个功能
    Note.findByIdAndDelete(request.params.id)
        .then(response.status(204).end())
        .catch(error => next(error))
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end()
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    Note.findOne({ content: body.content })
        .catch(error => {
            console.log(error)
            return response.status(400).json({
                error: 'commit same content, please correct it and try again'
            })
        })
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

//处理不支持路由的程序应该放在倒数第二个
const unknowEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknow endpoint' })
}
app.use(unknowEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformated id' })
    } else if (error.name === 'No Content') {
        return response.status(400).send({ error: 'data already been deleted' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
// 这必须是最后一个载入的中间件。
app.use(errorHandler)