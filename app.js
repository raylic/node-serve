const express = require('express')
const router = require('./router')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

//解决post无法接收参数的问题
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//跨域
app.use(cors())

//处理路由相关事务
app.use('/', router)

// 使 express 监听 5000 端口号发起的 http 请求
const server = app.listen(18082, function() {
  const { address, port } = server.address()
  console.log('Http Server is running on http://%s:%s', address, port)
})
