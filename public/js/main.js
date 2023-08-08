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

axios.get('/ifyouLogin')
	.then(res=>{
		
	})

$codeChat_btn.addEventListener("click", () => {
  window.location.href = `${window.location.origin}/page/CodeChat`;
});

$codeArena_btn.addEventListener("click", () => {
  window.location.href = `${window.location.origin}/page/CodeArena`;
});

$login_btn.addEventListener("click", () => {
  window.location.href = `${window.location.origin}/page/join`;
});

$('.m_logo').on('click',()=>{
	window.location.href = `${window.location.origin}/page/`;
})