const express = require('express')
const router = express.Router()

// 방 생성시 생성한 사용자 정보 응답
router.get('/createRoom',(req,res)=>{
    let checkEnd = req.session.userName
    res.send(JSON.stringify(checkEnd))
})

module.exports = router