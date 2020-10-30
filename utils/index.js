const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('./constant')

//从请求中解析出token内容
function decode(req) {
  const authorization = req.get('Authorization')
  let token = ''
  if (authorization.indexOf('Bearer') >= 0) {
    token = authorization.replace('Bearer ', '')
  } else {
    token = authorization
  }
  return jwt.verify(token, PRIVATE_KEY)
}
function md5(s){
    return crypto.createHash('md5')
    .update(String(s)).digest('hex');
}
function formatDate(date){
  let month = date.getMonth()+1;
  let day = date.getDate();
  if (month < 10){
    month = '0' + month;
  }
  if (day < 10){
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
}

function floatAdd(nums1, nums2){
  return (nums1*10 + nums2*10)/10;
}

module.exports = {
    md5,
    decode,
    formatDate,
    floatAdd
}