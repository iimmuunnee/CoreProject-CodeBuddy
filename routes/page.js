const express = require('express')
const router = express.Router()
router.use(express.static('public'));

// 메인페이지 http://localhost:3000/page
router.get('/',(req,res)=>{
    res.render('main')

    
})
// codeEditor http://localhost:3000/page/code
router.get('/code',(req,res)=>{
    res.render('codeEditor')
})

// 회원가입 및 로그인 http://localhost:3000/page/join
router.get('/join',(req,res)=>{
    res.render('join')
})

//Code Chat 채팅방 리스트 http://localhost:3000/page/CodeChat
router.get('/CodeChat',(req,res)=>{
    res.render('codeChatList')
})

//Code Arena 채팅방 리스트 http://localhost:3000/page/CodeArena
router.get('/CodeArena',(req,res)=>{
    res.render('codeArenaList')
})



module.exports = router