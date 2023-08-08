const express = require('express')
const router = express.Router()
router.use(express.static('public'));

// 메인페이지 http://localhost:3000/page
router.get('/',(req,res)=>{
    let seName = req.session.userName
    let seLevel = req.session.userlevel
    let seLogin = req.session.login
    res.render('main',{login : seLogin, name : seName, level : seLevel})
    // res.render('main')    
})
// codeEditor http://localhost:3000/page/code
router.get('/code',(req,res)=>{
    res.render('codeEditor')
})


router.get('/code2',(req,res)=>{
    res.render('codeEditor_Jo')
})


// 회원가입 및 로그인 http://localhost:3000/page/join
router.get('/join',(req,res)=>{
    let seName = req.session.userName
    let seLevel = req.session.userlevel
    let seLogin = req.session.login
    if(seLogin){
        res.render('main',{login : seLogin, name : seName, level : seLevel})
    }
    else{
        res.render('join')
    }
})

//Code Chat 채팅방 리스트 http://localhost:3000/page/CodeChat
router.get('/CodeChat',(req,res)=>{
    let seName = req.session.userName
    let seLevel = req.session.userlevel
    let seLogin = req.session.login
    // 비 로그인 상태에서 접속 요청시, 로그인 페이지로 이동
    // 로그인시 정상적으로 이동
    if(seLogin){
        res.render('codeChatList',{login : seLogin, name : seName, level : seLevel})
    }
    else{
        res.render('join')
    }
})

//Code Arena 채팅방 리스트 http://localhost:3000/page/CodeArena
router.get('/CodeArena',(req,res)=>{
    let seName = req.session.userName
    let seLevel = req.session.userlevel
    let seLogin = req.session.login
        // 비 로그인 상태에서 접속 요청시, 로그인 페이지로 이동
    // 로그인시 정상적으로 이동
    if(seLogin){
        res.render('codeArenaList',{login : seLogin, name : seName, level : seLevel})
    }
    else{
        res.render('join')
    }
})

//main 이외의 페이지에서 code Chat 클릭시
router.get('/mainMove',(req,res)=>{
    let seName = req.session.userName
    let seLevel = req.session.userlevel
    let seLogin = req.session.login
    res.render('main',{login : seLogin, name : seName, level : seLevel, code:true})
})

//main 이외의 페이지에서 code Arena 클릭 시
router.get('/mainArena',(req,res)=>{
    let seName = req.session.userName
    let seLevel = req.session.userlevel
    let seLogin = req.session.login
    res.render('main',{login : seLogin, name : seName, level : seLevel, arena:true})
})

// 로그아웃 시 세션 삭제
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.render('main', {logout : true})
})



module.exports = router