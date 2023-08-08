const express = require('express')
const router = express.Router()
const axios = require('axios')

// 데이터베이스 연결
const db = require('../config/database')
let conn = db.init()


// 회원가입
let checkEnd = false
router.post('/join',(req,res)=>{
    let id = req.body.userId // 사용자가 입력한 ID
    let pw = req.body.userPw // 사용자가 입력한 PW
    let name = req.body.userName // 사용자 이름
    let nick = req.body.userNick // 사용자가 입력한 NICKNAME
    let dev_year = req.body.dev_year // 신입개발자 or 경력개발자
    let school = req.body.school // 멘토 or 멘티
    let langJs = req.body.js // = js
    let langPy = req.body.py // = py
    let insertInfo = 'INSERT INTO TB_USER ( USER_ID , USER_PW , USER_NAME , USER_NICK , USER_LEVEL , USER_MENTORING) VALUES (?,?,?,?,?,?)';
    let insertLang = 'INSERT INTO TB_LANG ( USER_ID , LANG_SKILL) VALUES (?,?)'
    

    conn.connect()
    conn.query(insertInfo,[id,pw,name,nick,dev_year,school],(err,result)=>{
        if(err){
            // console.log('에러내용 :', err)
            console.log('이미 존재하는 ID 입니다.')
        }
        else{
            console.log('회원가입완료')
            if(langJs == 'javaScript'){
                conn.query(insertLang,[id,langJs],(err,result)=>{
                    if(err){
                        console.log('TB_LANG 쿼리문 오류')
                    } 
                })
            }
            if(langPy == 'python'){
                conn.query(insertLang,[id,langPy],(err,result)=>{
                    if(err){
                        console.log('TB_LANG 쿼리문 오류')
                    }
                })
            }
            
        }
        
    })
   
})

router.post('/checkend', (req, res) => {
    res.json({ success: true });
});



//아이디 중복체크
router.post('/idCheck',(req,res)=>{
    let id = req.body.idCheck
    let checkId = 'SELECT USER_ID FROM TB_USER WHERE USER_ID =?'
    console.log('아이디중복',req.body.idCheck)
    let checkEnd = true
    conn.connect();
    conn.query(checkId,[id],(err,result)=>{
        if(err){
            console.log('쿼리문 에러발생')
        }
        else{
            if(result.length == 0){
                console.log('회원가입가능')
            }
            else{
                console.log('이미 존재하는 아이디')
                checkEnd = false
            }
        }
        res.send(JSON.stringify(checkEnd))
    })
    
})



//로그인
router.post('/login',(req,res)=>{
    let id = req.body.userId
    let pw = req.body.userPw

    let loginSql = 'SELECT USER_ID, USER_PW, USER_NICK, USER_NAME, USER_LEVEL FROM TB_USER WHERE USER_ID =?'
    conn.connect()

    conn.query(loginSql,[id],(err,result)=>{
        if(err){
            console.log('쿼리문 에러')
        }
        else{
            if(result.length == 0){
                console.log('해당 아이디가 존재하지 않습니다.')
            }
            else{
                if(result[0].USER_ID == id && result[0].USER_PW == pw){
                    console.log(result[0].USER_NICK,'님이 접속하였습니다.')

                    // 접속자 세션생성
                    let userName = result[0].USER_NAME
                    let userLevel = result[0].USER_LEVEL
                    let seName = req.session.userName = userName
                    let seLevel = req.session.userlevel = userLevel
                    let seLogin = req.session.login = true
                    res.render('main',{login : seLogin, name : seName, level : seLevel})
                }
                else{
                    console.log('로그인이 실패하였습니다.')
                }
            }
        }
    })
})


router.get('/ifyouLogin',(req,res)=>{
    res.send(JSON.stringify(req.session.login))
})





module.exports = router

