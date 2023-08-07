const $codeChat_btn = document.getElementById("codeChat_btn"); // codeChat 시작하기 버튼
const $codeArena_btn = document.getElementById("codeArena_btn"); // codeArena 시작하기 버튼
const $login_btn = document.getElementById("login_btn"); // 상단 바에 있는 Login
const $userInfo_btn = document.getElementById('userInfo_btn') // Login이 되면 보여질 유저이름(닉네임)

function scrollToCodeChat() {
  const codeChatSection = document.getElementById("m_sodyd_chat"); // 해당 상단 바 클릭시 해당 위치로 스크롤 이동
  codeChatSection.scrollIntoView({ behavior: "smooth" });
}

// Function to scroll to the Code Arena section
function scrollToCodeArena() {
  const codeArenaSection = document.getElementById("m_sodyd_arena"); // 해당 상단 바 클릭시 해당 위치로 스크롤 이동
  codeArenaSection.scrollIntoView({ behavior: "smooth" });
}

// Add event listeners to the buttons
const codeChatButton = document.querySelector(".m_btn_c"); // 상단 바에 있는 CodeChat
const codeArenaButton = document.querySelector(".m_btn_a"); // 상단 바에 있는 CodeArena

codeChatButton.addEventListener("click", scrollToCodeChat);
codeArenaButton.addEventListener("click", scrollToCodeArena);

$codeChat_btn.addEventListener("click", () => {
  window.location.href = `${window.location.origin}/page/CodeChat`;
});

$codeArena_btn.addEventListener("click", () => {
  window.location.href = `${window.location.origin}/page/CodeArena`;
});

$login_btn.addEventListener("click", () => {
  window.location.href = `${window.location.origin}/page/join`;
});


