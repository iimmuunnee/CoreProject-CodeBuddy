const $codeChat_btn = document.getElementById("codeChat_btn"); // codeChat 시작하기 버튼
const $codeArena_btn = document.getElementById("codeArena_btn"); // codeArena 시작하기 버튼
const $login_btn = document.getElementById("login_btn"); // 상단 바에 있는 Login
const $userInfo_btn = document.getElementById('userInfo_btn') // Login이 되면 보여질 유저이름(닉네임)

function scrollToCodeChat() {
	const codeChatSection = document.getElementById("m_sodyd_chat");
	const headerHeight =  document.querySelector('.m_header').offsetHeight;
	const yOffset = codeChatSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
	window.scrollTo({ top: yOffset, behavior: 'smooth' });
}

function scrollToCodeArena() {
	const codeArenaSection = document.getElementById("m_sodyd_arena");
	const headerHeight =  document.querySelector('.m_header').offsetHeight;
	const yOffset = codeArenaSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
	window.scrollTo({ top: yOffset, behavior: 'smooth' });
}

// codeChatButton.addEventListener("click", scrollToCodeChat);
// codeArenaButton.addEventListener("click", scrollToCodeArena);



// Code Chat 클릭 시 로그인 유무에 따라 페이지 이동 or 로그인 요청
$codeChat_btn.addEventListener("click", () => {
	axios.get('/user/ifyouLogin')
		.then(res=>{
			console.log(res.data)
			if(res.data){
				window.location.href = `${window.location.origin}/page/CodeChat`;
			}
			else{
				alert('로그인하셈')
			}
		})
  
});

// Code Arena 클릭 시 로그인 유무에 따라 페이지 이동 or 로그인 요청
$codeArena_btn.addEventListener("click", () => {
	axios.get('/user/ifyouLogin')
		.then(res=>{
			console.log(res.data)
			if(res.data){
				window.location.href = `${window.location.origin}/page/CodeArena`;
			}
			else{
				alert('로그인하셈')
			}
		})
  
});

