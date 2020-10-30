const express = require('express')
const boom = require('boom')
const {
    CODE_ERROR,
    CODE_TOKEN_EXPIRED
} = require('../utils/constant')
const userRouter = require('./user')
const chartRouter = require('./chart')
const jwtAuth = require('./jwt')
const Result = require('../modules/Result')


//注册路由
const router = express.Router()

//对所有的路由进行jwt认证，不通过则会抛出token失效的异常
router.use(jwtAuth)

router.get('/', function(req, res) {
    res.send('hello')
  })

//集中处理/user相关的路由
router.use('/user', userRouter)

//集中处理/chart相关的路由
router.use('/chart', chartRouter)

//处理404 
router.use((req, res, next) => {
    next(boom.notFound('接口不存在'))
})

//异常处理中间件
router.use((err, req, res, next) => {
    //如果是token异常的话
    if (err.name === 'UnauthorizedError') {
      new Result(null, 'Token失效', {
        error: err.status,
        errorMsg: err.name,
        code: CODE_TOKEN_EXPIRED
      }).expired(res.status(err.status))
    } else{
      const msg = (err && err.message) || '系统错误'
      const statusCode = (err.output && err.output.statusCode) || 500;
      const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
      res.status(statusCode).json({
        code: CODE_ERROR,
        msg,
        error: statusCode,
        errorMsg
      })
    }
})

module.exports = router