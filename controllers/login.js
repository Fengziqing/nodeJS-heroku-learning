//实现登陆功能
const jwt = require('jsonwebtoken')
//加密？不太确定
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    //因为密码本身没有被保存到数据库中，而是从密码中计算出的哈希，bcrypt.compare方法被用来检查密码是否正确

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    //jwt.sign方法创建一个令牌。该令牌以数字签名的形式包含用户名和用户ID。
    // const token = jwt.sign(userForToken, process.env.SECRET)
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }//expire 限制token使用时间
    )

    response
        .status(200)
        .send({ token, username: username, name: username })
})

module.exports = loginRouter