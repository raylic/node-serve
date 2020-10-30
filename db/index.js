const mysql = require('mysql')
const config = require('./config')

//配置文件传入连接配置
function connect() {
    return mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      multipleStatements: true
    })
}

//根据sql语句创建一个promise 对象
function querySql(sql) {
    const conn = connect();
    return new Promise((resolve, reject) =>{
        try{
            conn.query(sql,(err, result) => {
              if(err){//在query出错的情况下
                  console.log("sql error");
                  reject(err);
              }  
              else {
                  resolve(result);
              }
            })
        }
        catch(e) {
            reject(e)
        }
        finally{
            conn.end()
        }
    })
}
function queryOne(sql) {
    return new Promise((resolve, reject) => {
      querySql(sql)
        .then(results => {
          if (results && results.length > 0) {
            resolve(results[0])
          } else {
            resolve(null)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
module.exports = {
    querySql,
    queryOne
}