require('dotenv').config()
const express = require('express')
const app = express()
const cors =require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         date: "2022-05-30T17:30:31.098Z",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only Javascript",
//         date: "2022-05-30T18:39:34.091Z",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         date: "2022-05-30T19:20:14.298Z",
//         important: true
//     },
//     {
//         id: 4,
//         content: " HTTP protocol",
//         date: "2022-06-30T19:27:14.298Z",
//         important: false
//     }
// ]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes =>{
        response.json(notes)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/notes/:id',(request, response, next) => {
    // const id = Number(request.params.id)
    // const note = notes.find(note => {
    //     return note.id === id
    // })
    // if(note){
    //     response.json(note)  
    // }else{
    //     response.status(404).end()
    // }
    Note.findById(request.params.id)
    .then(note => {
        if(note){
            response.json(note)
        }else{
            response.status(404).end
        }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id',(request,response,next) => {//暂时没有这个功能
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length>0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}
app.post('/api/notes',(request,response) => {
    const body = request.body

    if(body.content === undefined){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    Note.findOne({content: body.content})
    .catch(error => {
        console.log(error)
        return response.status(400).json({
            error: 'commit same content, please correct it and try again'
        })
    })
    const note = new Note({
        content: body.content,
        important: body.important||false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.put('/api/notes/:id',(request,response,next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    
    Note.findByIdAndUpdate(request.params.id, note, {new:true})
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .catch(error => next(error))
    // if(!notes.find(note => note.id === request.body.id)){
    //     return response.status(404).json({error :'bad request'})
    // }
    // const newNotes = notes.map(note => note.id === request.body.id ? request.body : note)
    // notes = newNotes
    // response.json(newNotes)
})

//处理不支持路由的程序应该放在倒数第二个
const unknowEndpoint = (request, response) => {
    response.status(404).send({error:'unknow endpoint'})
}
app.use(unknowEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error:'malformated id'})
    }else if(error.name === 'No Content'){
        return response.status(400).send({error: 'data already been deleted'})
    }
    
    next(error)
}
// 这必须是最后一个载入的中间件。
app.use(errorHandler)