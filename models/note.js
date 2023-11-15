const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(console.log('connect to MongoDB'))
    .catch((error) => {//error 为什么要用括号括起来
        console.log('error connecting to MongoDB', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5, //内置
        required: true//内置
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
