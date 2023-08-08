const gameSocket = io("/game"); // io 함수는 알아서 socket.io를 실행하고 서버를 찾습니다.

const $c_main_content = $chat_main.querySelector(".c_main_content"); // 채팅 내용이 들어갈 곳

const $c_chatting = $chat_main.querySelector(".c_chatting"); // 채팅작성 및 전송
const $c_chatting_form = $c_chatting.querySelector(".c_chatting_form"); // 채팅 작성 form
const $form_input = $c_chatting_form.querySelector("#form_input"); // 채팅 작성 form의 input
const roomName = localStorage.getItem("roomName"); // localStorage에서 방 이름을 가져오기
let nickname = localStorage.getItem("nickname"); // localStorage에서 닉네임을 가져오기

// 움직이는 모달
$(document).on("ready", () => {
  //모달 움직이게 하려면, draggable(); 하면 된다.
  $("#c_content_move button").draggable();
});

// 전송 버튼 ENTER 키 기능
function susubmit(f) {
  if (f.keyCode == 13) {
    c_chatting_form.submit();
  }
}
// textarea -> 줄바꿈_Shift+Enter 버튼 실행
$(function () {
  $("textarea").on("keydown", function (event) {
    if (event.keyCode == 13)
      if (!event.shiftKey) {
        event.preventDefault();
        $("#testForm").submit();
      }
  });
});

// 채팅 내용 왔다리 갔다리
const Chat = (function () {
  const myName = "blue";

  // init 함수
  function init() {
    // enter 키 이벤트
    $(document).on("keydown", "c_chatting_1 textarea", function (e) {
      if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        const message = $(this).val();

        // 메시지 전송
        sendMessage(message);
        // 입력창 clear
        clearTextarea();
      }
    });
  }

  // 메세지 태그 생성
  function createMessageTag(LR_className, senderName, message) {
    // 형식 가져오기
    let chatLi = $("div.chat1.format ul li").clone();

    // 값 채우기
    chatLi.addClass(LR_className);
    chatLi.find(".sender span").text(senderName);
    chatLi.find(".message span").text(message);

    return chatLi;
  }

  // 메세지 태그 append
  function appendMessageTag(LR_className, senderName, message) {
    const chatLi = createMessageTag(LR_className, senderName, message);

    $("div.chat:not(.format) ul").append(chatLi);

    // 스크롤바 아래 고정
    $("div.chat1").scrollTop($("div.chat1").prop("scrollHeight"));
  }

  // 메세지 전송
  function sendMessage(message) {
    // 서버에 전송하는 코드로 후에 대체
    const data = {
      senderName: "blue",
      message: message,
    };

    // 통신하는 기능이 없으므로 여기서 receive
    resive(data);
  }

  // 메세지 입력박스 내용 지우기
  function clearTextarea() {
    $("c_chatting_1 textarea").val("");
  }

  // 메세지 수신
  function resive(data) {
    const LR = data.senderName != myName ? "left" : "right";
    appendMessageTag("right", data.senderName, data.message);
  }

  return {
    init: init,
  };
})();

$(function () {
  Chat.init();
});

// 방 떠나기 함수
const handleLeaveRoom = () => {
  gameSocket.emit("leave_room", { room_name: roomName, nickname: nickname });
  const newUrl = `${window.location.origin}`;
  window.location.href = newUrl; // 나갈 때 방 입장 전 페이지로 이동
};

// 단순히 채팅을 띄워주는 역할
const addMessage = (nickname, message) => {
  const $div = document.createElement("div");
  $div.textContent = `${nickname} : ${message}`;
  $c_main_content.appendChild($div);
};

// 공지
const addNotice = (message) => {
  console.log("addNotice 함수 실행");
  const $div = document.createElement("div");
  console.log("message : ", message);
  $div.textContent = message;
  $c_main_content.appendChild($div);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const message = $form_input.value; // 메시지 입력값 가져오기
  console.log("메세지 핸들러, 메세지 : ", message);
  console.log("메세지 버튼 클릭시 roomName 확인 : ", roomName);

  // 메시지 전송
  // console.log(typeof(gameSocket)) // object
  gameSocket.emit(
    "new_message",
    { message: message, roomName, nickname },
    () => {
      addMessage(nickname, message);
    }
  );

  $form_input.value = ""; // 입력 창 초기화
};
// ---------------함수 정의 끝------------------

gameSocket.on("connect", () => {
  // console.log("프론트와 서버와의 연결 성공");
});

gameSocket.on("new_message", ({ nickname, message }) => {
  console.log("new_message이벤트 프론트에서 받음");
  addMessage(nickname, message);
});

// 프론트로 온 이벤트 감지
gameSocket.onAny((event) => {
  console.log(`gameSocket Event: ${event}`);
});

gameSocket.on("welcome", ({ nickname, newCount }) => {
  console.log("프론트 welcome 옴");
  // $user_count.textContent = `${user_count}명`;
  addNotice(`${nickname}(이)가 방에 입장했습니다. ${newCount}`);
  // setUserCount(user_count);
});

gameSocket.on("user_count", ({ room_name, user_count }) => {
  console.log(`user_count 이벤트의 사용자 수: ${user_count}`);
  $c_content_num.textContent = `${user_count}`;
});

gameSocket.on("bye", ({ nickname, newCount }) => {
  console.log("프론트 bye이벤트 옴");
  console.log(`${nickname}은 방을 나갔습니다. `);
  addNotice(`${nickname}(이)가 방에서 나갔습니다. ${newCount}`);
  // window.location.href를 사용하여 다른 페이지로 리디렉션할 수 있습니다.
  // 예: window.location.href = "/room_input_page";
});

$c_chatting_form.addEventListener("submit", handleMessageSubmit);
