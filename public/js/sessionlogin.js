    // 로그인 했을 시 사용자 이름 표시
  let login = '{{login}}'
  let logout = '{{logout}}'

    if(login) {
      document.querySelector('#login_btn').style.display = 'none'
      document.querySelector('#userInfo_btn').style.display = 'inline'
    }
    
    if(logout){
      document.querySelector('#login_btn').style.display = 'inline'
      document.querySelector('#userInfo_btn').style.display = 'none'
    }