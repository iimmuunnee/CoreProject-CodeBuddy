const express = require('express')
const router = express.Router()

// 데이터베이스 연결
const db = require('../config/database')
let conn = db.init()

// 방 생성시 생성한 사용자 정보 응답
router.get('/createRoom',(req,res)=>{
    let checkEnd = req.session.userName
    res.send(JSON.stringify(checkEnd))
})


// 방 생성시 방 정보 database에 저장
router.post('/updateroom',(req,res)=>{
    console.log('방정보',req.body.updateRooms[0])
    let roomInfo = req.body.updateRooms[0]
    let number = roomInfo.room_number
    let name = roomInfo.room_name
    let method = roomInfo.chatRoomMethod
    let lang = roomInfo.dev_lang
    let host = roomInfo.createdBy
    let count = roomInfo.userCount

    let sql = 'INSERT INTO TB_ARENAROOM VALUES(?,?,?,?,?)'
    let findRoom = 'SELECT * FROM TB_ARENAROOM WHERE ROOM_NUMBER =?'

    conn.connect()
    conn.query(sql,[number,name,lang,host,count],(err,result)=>{
        if(err){
            console.log('방생성 쿼리문 오류',err)
        }
        else{
         conn.query(findRoom,[number],(err,result)=>{
            console.log('보자보자',result)
            res.json(JSON.stringify(result[0]))
         })
        }
    })
})


module.exports = router