const express = require('express')
const router = express.Router()
const { findUser, insertToCost, getCostById, deleteCostById } = require('../service/login')
const Result = require('../modules/Result')
const { formatDate, floatAdd } = require('../utils') 


//还没有参数验证
router.post('/deletebycid', function(req, res) {
  //查询用户名对应id
  if(req.user.username && req.body){
    findUser(req.user.username).then(user => {
      if(user){
        deleteCostById(req.body.cid, user.uid).then(() =>{
          new Result("删除成功").success(res)
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

//传回 days 天前的
router.get('/table', function(req, res) {
  if(req.user.username){
    findUser(req.user.username).then(user => {
      if(user){
        getCostById(user.uid).then(result =>{
          let date = new Date();
          let returnData = Array.from(result)                 
          if(req.query.days > 0){
            date.setTime(date - Number(req.query.days-1) * 1000 * 60 *60 * 24);
              returnData = returnData.filter(item => {
              return item.date >= formatDate(date);
            })
          }
          new Result(returnData, "获取记录成功").success(res)
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
//传回 所有用户相关数据
router.get('/totalpiedata', function(req, res) {
  if(req.user.username){
    findUser(req.user.username).then(user => {
      if(user){
        getCostById(user.uid).then(result =>{
          const dataSet = Array.from(result);
          let returnData = [
            {value: 0, name:'固定支出'},
            {value: 0, name:'日常支出'},
            {value: 0, name:'额外消费'}
          ];
          let index = 0;
          for(let item of dataSet){
            switch(item.tag){
              case'固定': index = 0; break;
              case'日常': index = 1; break;
              case'额外': index = 2; break;
            }
            returnData[index].value = floatAdd(returnData[index].value, item.cost);
          }
          new Result(returnData, "获取记录成功").success(res)
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
//还没有参数验证
router.post('/upload', function(req, res) {
  //查询用户名对应id
  if(req.user.username){
    findUser(req.user.username).then(user => {
      if(user){
        const insertData = {
          uid: user.uid,
          tag: req.body.tag,
          date: req.body.date,
          use: req.body.use,
          cost: req.body.cost
        }
        //上传
        insertToCost(insertData).then(result =>{
          new Result(result,"上传成功").success(res);
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