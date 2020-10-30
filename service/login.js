const {querySql,queryOne} = require('../db')

function login(username, password){
  const sql = `select * from user where username ='${username}' and password = '${password}'`
  return querySql(sql)
}
function findUser(username) {
  const sql = `select * from user where username='${username}'`
  return queryOne(sql)
}
function insertToCost(data) {
  const sql = 'insert into cost (`uid`, `tag`, `date`, `use`, `cost`) VALUES' + ` ('${data.uid}', '${data.tag}', '${data.date}', '${data.use}', '${data.cost}') `
  return querySql(sql)
}
function getCostById(uid) {
  const sql = `select * from cost where uid = '${uid}' ORDER BY date DESC, cid DESC`
  return querySql(sql)
}
function deleteCostById(cid, uid) {
  const sql = `delete from cost where (cid = '${cid}' and uid = '${uid}')`
  return querySql(sql)
}
module.exports = {
    login,
    findUser,
    insertToCost,
    getCostById,
    deleteCostById
}