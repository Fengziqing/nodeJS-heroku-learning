const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.connect(url)
.then(result => {
    console.log('connect to MongoDB')
})
.catch((error) =>{//error 为什么要用括号括起来
    console.log('error connecting to MongoDB', error.message)
})

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})
noteSchema.set('toJSON',{
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)