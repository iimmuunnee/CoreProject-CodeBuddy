const socket = io('/CodeChat')

const htmlText = document.getElementById('html')
const cssval = document.getElementById('css').value

let htmlT = ''
let cssT = ''
let jsT = ''
let btn = document.querySelector('#submit')


let htmlVal = ''
htmlText.addEventListener('input',()=>{
    htmlVal = htmlText.value
})


// 버튼 클릭시 서버로 html 입력값 전송
btn.addEventListener('click',(sub)=>{
    sub.preventDefault() // input과 submit 등의 고유 동작으로 페이지가 reroad 하는 현상을 막아줌
    htmlT = html.getValue()
    cssT = css.getValue()
    jsT = js.getValue()

    socket.emit('submit',{html : htmlT, css : cssT, js : jsT})
})


// 서버에서 전송한 코드 입력
socket.on('codeEditor',(code)=>{
    html2.setValue(code.html)
    css2.setValue(code.css)
    js2.setValue(code.js)
})
