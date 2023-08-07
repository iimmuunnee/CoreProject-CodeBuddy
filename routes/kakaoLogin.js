const express = require('express')
const router = express.Router()
const axios = require('axios')
const qs = require('qs')

const kakao = {
    clientID: '26a67f6dd1060e59ee12026dc578b8f2',
    clientSecret: 'g9UWpzjYsEOda3L8UtbX6ojpBLLQzJBP',
    redirectUri: 'https://localhost:3000/kakao/callback'
}


router.get('/kakao',(req,res)=>{
    
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}`;
    res.redirect(kakaoAuthURL);
})

router.get('/kakao/callback', async(req,res)=>{
    let token;
    try{
            token = await axios({
            method:'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: qs.stringify({
              grant_type: 'authorization_code',
              client_id: kakao.clientID,
              client_secret: kakao.clientSecret,
              redirectUri: kakao.redirectUri,
              code: req.query.code,
            })
          })
          .then(res=>{
            console.log('확인해봐',res.data)
          })
          .catch(error =>{
            console.error('에러발생')
          })
    }catch(err){
        res.json(err.data)
    }


    let user;
    try{
        console.log(token);//access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
        user = await axios({
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`
            }
        })
    }catch(e){
        res.json(e.data);
    }
    console.log(user);
 
    req.session.kakao = user.data;    
    res.send('success');

})






module.exports = router