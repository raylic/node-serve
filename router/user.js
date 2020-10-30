const express = require('express')
const router = express.Router()
const {login, findUser} = require('../service/login')
const Result = require('../modules/Result')
const { md5, decode } = require('../utils')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED} = require('../utils/constant')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')

router.get('/', function(req, res) {
    res.send('user')
})

router.get('/info', function(req, res) {
  let decodeMsg = decode(req)
  if(decodeMsg && decodeMsg.username){
    findUser(decodeMsg.username).then(user => {
      if(user){
        user.roles = [ user.role ]
        new Result(user, '获取用户信息成功').success(res)
      }
      else{
        new Result("获取用户信息失败").fail(res)
      }
    })
  } 
  else
    new Result("无法解析到用户名").fail(res)
})

router.post(
  '/login',
  [
    body('username').isString().withMessage('username必须为字符'),
    body('password').isString().withMessage('password必须为字符')
  ],
  function(req, res, next) {
  const username = req.body.username
  let password = req.body.password
  //参数验证
  const err = validationResult(req)
  if(!err.isEmpty()){
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  }
  else {
    //加密
    password = md5(`${password}${PWD_SALT}`)
    login(username, password).then(result => {
      if(result.length){
        //生成token
        const token = jwt.sign(
          { username },
          PRIVATE_KEY,
          { expiresIn: JWT_EXPIRED }
        )
        //验证成功发送token
        new Result( { token } ,'登录成功').success(res);
      }
      else
      {
        //验证失败
        new Result('用户名或密码错误').fail(res);
      }
    })
  }
})

router.post('/upload', function(req, res) {
  console.log(req.user.username);
  console.log(req.body);
  //查询用户名对应id
  if(req.user.username){
    findUser(req.user.username).then(user => {
      if(user){
        const insertData = {
          uid: user.uid,
          tag: req.body.tag,
          date: req.body.date,
          use: req.body.use,
          cost: req.body.price
        }
        //上传
        insertToCost(insertData).then(result =>{
          new Result("上传成功").success(res);
        }).catch( err =>{
          console.log(err);
          new Result("数据库错误").fail(err);
        })
      }
      else{
        new Result("获取用户信息失败").fail(res)
      }
    })
  } 
  else
    new Result("无法解析到用户名").fail(res)
})

module.exports = router