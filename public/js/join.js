// 지훈 수정 - 회원가입 아이디 검증 로직


const idBtn = document.getElementById('idBtn')
const idCk = document.getElementById('idCk')
const subBtn = document.getElementById('subBtn')
const idInput = document.querySelector('#inputId')
// 아이디 중복체크 확인여부
let dupCk = false
// 아이디 사용가능 여부
let idUse = false

//아이디 중복검사 
function idCheckHandler(){
    const data = document.querySelector('#inputId').value
    axios.post('/user/idCheck', {idCheck : data})
        .then(res=>{
            if(res.data){
                if(data == ''){
                    idCk.innerText = '아이디를 입력해주세요.'
                    idCk.style.color = 'red'
                    idUse = false
                }
                else{
                    idCk.innerText = '사용이 가능한 아이디 입니다.'
                    idCk.style.color = 'green'
                    idUse = true
                    checkMsg.innerText = ''
                }                            
            }
            else{
                idCk.innerText = '중복된 아이디 입니다.'
                idCk.style.color = 'red'
                idUse = false
            }
        })
        dupCk = true           
}


// 아이디 중복버튼 클릭 시 중복검사 
idBtn.addEventListener('click',idCheckHandler)

// 아이디 수정시 중복체크여부 초기화
idInput.addEventListener('input',()=>{
    dupCk = false
})

// 회원가입 클릭시
subBtn.addEventListener('click',(event)=>{
    // 중복체크와 아이디 사용가능 여부 확인 후에 폼 제출하기 위해 폼 제출 기능 차단
    event.preventDefault()
    if(dupCk == false){
        checkMsg.innerText = '아이디 중복체크를 해주세요'
        checkMsg.style.color = 'red'
    }
    else{
        if(idUse == false){
        checkMsg.innerText = '아이디를 확인해주세요'
        checkMsg.style.color = 'red'
        }
    }
    if(dupCk && idUse){
        // 중복체크 확인과 아이디 사용 가능 시 form 제출
        const myForm = document.getElementById('myform');
        myForm.submit(); // 폼 제출

        // 회원가입 성공시 자동 로그인 버튼 클릭
        axios.post('/user/checkend',{ck : 'hello'})
        .then(res=>{
            if(res.data.success){
                document.getElementById('loginCk').click()
            }
            else{
                console.log('에러',res.data)
            }
        })
    }
})