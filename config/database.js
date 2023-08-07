const mysql = require('mysql2')

let conn = {
    host : 'project-db-stu3.smhrd.com',
    user : 'Insa4_JSA_hacksim_5',
    password : 'aishcool5',
    port : '3307',
    database : 'Insa4_JSA_hacksim_5'
}
module.exports = {
    init : ()=>{
        return mysql.createConnection(conn)
    }
}