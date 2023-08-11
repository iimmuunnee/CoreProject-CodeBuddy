const express = require('express')
const router = express.Router()

router.post('/codeStart',(req,res)=>{
    console.log('되나?',req.body)
})


module.exports = router