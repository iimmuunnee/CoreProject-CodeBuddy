const express = require('express')
const router = express.Router()

// 데이터베이스 연결
const db = require('../config/database')
let conn = db.init()




module.exports = router