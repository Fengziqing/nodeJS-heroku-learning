const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request,response) => {
    //populate方法是在进行初始查询的find方法之后连锁进行的
    //引用note对象在user文档的notes字段将被引用的note文档替换
    //Mongoose的populate方法的功能是基于我们用ref选项为Mongoose模式中的引用定义了 "类型"
    const users = await User.find({}).populate('notes',{ content:1,date:1 })
    response.status(200).json(users)
})

usersRouter.post('/', async (request,response) => {
    const { username, name, password } = request.body

    //验证唯一性
    const existingUser = await User.findOne({ username })
    if(existingUser){
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter