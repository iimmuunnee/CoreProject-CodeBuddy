const getCurrentURL = () => {
  return window.location.href;
};
const getNamespaceFromURL = (url) => {
  if (url.includes("CodeArena")) {
    return "/CodeArena";
  }
};

const currentURL = getCurrentURL();
const namespace = getNamespaceFromURL(currentURL);
const arenaSocket = io(namespace);
// const arenaSocket = io.of('/page/CodeArena');

// socket.io 사용
// 방의 이름을 입력받고 방에 입장할 수 있는 페이지 담당 js

const $make_room_form = document.querySelector("#make_room_form"); // 방 정보 입력 폼
const $room_name = document.getElementById("room_name"); // 방 이름 입력 input
const $dev_lang = document.getElementById("dev_lang"); // 방의 언어 방식 select

const $chat = document.getElementById("chat"); // 전체 div 채팅창 선택
const $chat_1 = $chat.querySelector(".chat_1"); // 접근 1
const $chat_main = $chat_1.querySelector(".chat_main"); // 접근 2
const $c_roomname = $chat_main.querySelector(".c_roomname"); // 방 이름으로 접근
const $c_roomname_1 = $c_roomname.querySelector(".c_roomname_1"); // 방 이름을 접근 2
const $c_content_name = $c_roomname_1.querySelector(".c_content_name"); // 방 이름을 접근 3
const $c_c_name = $c_content_name.querySelector(".c_c_name"); // 방 이름을 적는 곳
const $mini_room_name = document.getElementById("mini_room_name"); // 미니 방 이름 적는 곳
const $c_content_num = $c_content_name.querySelector(".c_content_num"); // 방 인원수 적는 곳
const $mini_room_users = document.getElementById("$mini_room_users"); // 미니 방 인원수 적는 곳
const $c_a_u_r_name2 = document.querySelector(".c_a_u_r_name2");

const openarena = () => {
  let page = document.getElementById("code_arena_zip");
  page.style.display = "block";

  let page2 = document.getElementById("notice");
  page2.style.display = "none";

  let chat = document.getElementById("chat_open");
  chat.style.display = "block";

  let header = document.getElementById("head");
  header.style.display = "none";

  //code editor 기본 값 입력
  js.setValue(`function codeBuddy(n){
    let result;
    result = '정답을입력하세요';
    return result;
}`);
};
let currentNickname;
// 방 생성 함수
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const room_name = $room_name.value;
  const dev_lang = $dev_lang.value;
  // 지훈 코드 삽입 (방생성)
  axios.get("/room/createRoom", { room: "hi" }).then((res) => {
    currentNickname = res.data; // 방 생성자의 닉네임
    arenaSocket.emit("create_room", {
      room_name: room_name,
      dev_lang: dev_lang,
      nickname: res.data, // 방 생성자 이름
    });

    arenaSocket.emit("check_admin", { nickname: res.data });

    closeModal(); // 모달 닫고
    // openarena(); // 방 입장
    // arenaSocket.emit("welcome", { nickname: res.data });
    $room_name.value = ""; // 방 입력칸 초기화
  });

  $c_c_name.textContent = room_name; // 채팅방 펼쳤을 때 방제
  $mini_room_name.textContent = room_name; // 채팅방 접었을 때 방제
  $c_a_u_r_name2.textContent = room_name; // Arena 제한 시간 위 방제
};

// 방 생성시 방장 권한 부여
arenaSocket.on("admin_status", ({ isAdmin }) => {
  console.log("admin_status", isAdmin);
  if (isAdmin) {
    console.log("이 방의 방장입니다!");
    arenaSocket["isAdmin"] = isAdmin;
  }
});

// 방목록 최신화 ------------------지훈---------------------

let roomName = "";
let roomNum;
let roomLinks;
let clickEventHandler = null;

const handleClick = (e) => {
  const target = e.target;
  if (target.classList.contains("room-link")) {
    let roomNumber = target.getAttribute("data-roomnumber");
    roomNumber = parseInt(roomNumber);
    const roomName = target.getAttribute("data-roomname");
    const roomHost = target.getAttribute("data-roomhost");
    if (roomNumber) {
      enterRoom(roomName, roomNumber, roomHost);
    }
  }
};
//최신화 함수

const updateArenaRoom = (roomList) => {
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $tr = document.querySelectorAll("tr");
  // $tr.remove();

  if (clickEventHandler) {
    $tbody.removeEventListener("click", clickEventHandler);
  }
  console.log("updateArenaRoom", roomList);

  roomList.forEach((roomInfo) => {
    const newRow = document.createElement("tr");
    newRow.id = "room_" + roomInfo.ROOM_NUMBER;
    // console.log(roomInfo);
    // 방 정보를 td에 추가
    newRow.innerHTML = `
            <td id="room-Num">${roomInfo.ROOM_NUMBER}</td>
            <td class="item ${roomInfo.ROOM_LANG}">${roomInfo.ROOM_LANG}</td>
            <th>
              <a id='123' class="room-link room-${roomInfo.ROOM_NUMBER}" data-roomnumber="${roomInfo.ROOM_NUMBER}" data-roomname="${roomInfo.ROOM_NAME}" data-roomhost="${roomInfo.ROOM_HOST}">${roomInfo.ROOM_NAME} ( ${roomInfo.USER_COUNT} / 4 )</a>
              <p>테스트</p>
             </th>
            <td>${roomInfo.ROOM_HOST}</td>
      `;
    // 새로운 행을 테이블의 맨 위에 추가
    $tbody.prepend(newRow);

    // axios.get("/room/createRoom", { room: "hi" }).then((res) => {
    //   currentNickname = res.data;
    // });

    clickEventHandler = handleClick;
    $tbody.addEventListener("click", clickEventHandler);

    // console.log("updateArenaRoom", roomInfo.USER_COUNT);
    $c_content_num.textContent = `${roomInfo.USER_COUNT}/4`; // 채팅방 펼쳤을 때 인원 수
    $mini_room_users.textContent = `${roomInfo.USER_COUNT}/4`; // 채팅방 접었을 때 인원 수
  });
};

// arenaSocket.on("connect", () => {
//   console.log("프론트와 서버와의 연결 성공");
// });

// 사용자 접속시 채팅방 리스트 최신화
arenaSocket.on("updateRoomList", () => {
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  axios.get("/room/arenaList", { re: "hi" }).then((res) => {
    let roomList = JSON.parse(res.data);
    console.log("roomList : ", roomList);
    $trs.forEach(($tr) => {
      $tr.remove();
    });
    updateArenaRoom(roomList);
  });
});

// 방 생성시 채팅방 리스트 최신화(기존의 테이블 tr 모두 삭제 후 최신화)
arenaSocket.on("updateRoomList2", () => {
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  axios.get("/room/arenaList", { re: "hi" }).then((res) => {
    let roomList = JSON.parse(res.data);
    $trs.forEach(($tr) => {
      $tr.remove();
    });
    updateArenaRoom(roomList);
  });
});

// 인원수 실시간 업데이트
arenaSocket.on("countUpdate", (data) => {
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  $trs.forEach(($tr) => {
    $tr.remove();
  });
  updateArenaRoom(data.data);
});

//방장이 방 생성시 database에 방 정보 입력 및 방 입장 처리
arenaSocket.on("host_enterRoom", (data) => {
  let nickName = data[0].createdBy;
  let roomName = data[0].room_name;
  let roomNum = data[0].room_number;
  console.log("", data);
  const addRoomToTable = (updateRooms) => {
    axios.post("/room/updateroom", { updateRooms }).then((res) => {
      let roomInfo = JSON.parse(res.data);
    });
  };
  addRoomToTable(data);
  enterRoom(roomName, roomNum, nickName);
});

// --------------------지훈 끝--------------------------------
//
$make_room_form.addEventListener("submit", handleRoomSubmit);

arenaSocket.on("update_room_list", (roomInfo) => {
  // console.log("roomInfo : ", roomInfo);
  // updateRoomList(roomInfo);
  addRoomToTable(roomInfo);
});

// //방 목록 database에 새로운 방 추가하는 함수
const addRoomToTable = (updateRooms) => {
  axios.post("/room/updateroom", { updateRooms }).then((res) => {
    let roomInfo = JSON.parse(res.data);
    arenaSocket.emit("newlist");
  });
};
const enterRoom = (roomName, roomNum, roomHost) => {
  console.log("enterRoom 실행");
  // console.log("enterRoom 함수의 currentNickname : ", currentNickname);
  axios.post("/room/enterRoom", { roomNum }).then((res) => {
    let data = JSON.parse(res.data);
    currentNickname = data.name;
    arenaSocket.emit("enter_room", {
      room_name: roomName,
      nickname: data.name,
      room_number: roomNum,
      room_host: roomHost,
    });
    arenaSocket.emit("userCount", { data: data.result });
  });
  //휘훈아!!!!!!!!!!!!!!!!!!!!! 유저접속
  axios.post("/room/connectUser", { roomNum }).then((res) => {
    let data = JSON.parse(res.data);
    console.log("가져와져랏", data);
  });
  $c_c_name.textContent = roomName; // 채팅방 펼쳤을 때 방제
  $mini_room_name.textContent = roomName; // 채팅방 접었을 때 방제
  $c_a_u_r_name2.textContent = roomName; // Arena 제한 시간 위 방제

  arenaSocket.on("user_count", ({ user_count }) => {
    console.log("user_count 이벤트 도착");
    console.log(user_count);
    $c_content_num.textContent = `${user_count}/4`;
    $mini_room_users.textContent = `${user_count}/4`;
  });

  openarena(); // 방 입장
};

const $leave_room = document.getElementById("leave_room");

const leaveRoomBtn = () => {
  console.log("leaveRoomBtn 함수 활성화");
  let page = document.getElementById("code_arena_zip");
  page.style.display = "none";

  let page2 = document.getElementById("notice");
  page2.style.display = "block";

  let chat = document.getElementById("chat_open");
  chat.style.display = "none";

  arenaSocket.emit("leave_room", { currentNickname });
  arenaSocket.emit("leave_count");
};
arenaSocket.on("leaveuser", (data) => {
  //휘훈아!!!!!!!!!!!!!!!!!!!!! 유저 나감
  axios.post("/room/disconnectUser", { data });

  axios.post("/room/leave", { data }).then((res) => {
    let data = JSON.parse(res.data);
    arenaSocket.emit("userCount", { data: data.result });
    location.reload();
  });
});
$leave_room.addEventListener("click", leaveRoomBtn);

// 인원 수 초과 됐을 때
arenaSocket.on("user_full", () => {
  alert("방 인원 초과");
});

window.addEventListener("beforeunload", () => {
  arenaSocket.emit("leave_count");
  arenaSocket.emit("leave_room", { currentNickname });
});

arenaSocket.on("disconnect", () => {
  console.log("disconnect to server");
});

// -------------------------리스트 페이지 끝 -----------CodeArena 페이지 시작---------------------------------------------------------------------
const $c_main_content = $chat_main.querySelector(".c_main_content"); // 채팅 내용이 들어갈 곳
const $c_chatting = $chat_main.querySelector(".c_chatting"); // 채팅작성 및 전송
const $c_chatting_form = $c_chatting.querySelector(".c_chatting_form"); // 채팅 작성 form
const $form_input = $c_chatting_form.querySelector("#form_input"); // 채팅 작성 form의 input
const $c_chatting_2 = $c_chatting_form.querySelector(".c_chatting_2");
const $c_chatting_2_btn = $c_chatting_2.querySelector(".c_chatting_2_btn");

// 공지
const addNotice = (message) => {
  console.log("addNotice 함수 실행");
  const $div = document.createElement("div");
  // console.log("message : ", message);
  $div.textContent = message;
  $c_main_content.appendChild($div);
};

const handleMessageSubmit = (event) => {
  console.log("handleMessageSubmit 함수 실행");
  event.preventDefault();
  const message = $form_input.value; // 메시지 입력값 가져오기
  // console.log("메세지 핸들러, 메세지 : ", message);
  // console.log("userInfo : ", currentNickname);
  console.log("핸들메세지함수", currentNickname); // 보낸 사람의 닉네임

  arenaSocket.emit("new_message", { currentNickname, message: message });

  $form_input.value = ""; // 입력 창 초기화
};
// ---------------함수 정의 끝------------------

arenaSocket.on("connect", () => {
  console.log("프론트와 서버와의 연결 성공");
});

arenaSocket.on("my_message", ({ currentNickname, message }) => {
  console.log("new_message이벤트 프론트에서 받음");
  const $div = document.createElement("div");
  $div.textContent = `(본인)${currentNickname} : ${message}`;
  $c_main_content.appendChild($div);
});

arenaSocket.on("other_message", ({ currentNickname, message }) => {
  console.log("new_message이벤트 프론트에서 받음");
  const $div = document.createElement("div");
  $div.textContent = `(상대)${currentNickname} : ${message}`;
  $c_main_content.appendChild($div);
});

// 프론트로 온 이벤트 감지
arenaSocket.onAny((event) => {
  console.log(`arenaSocket Event: ${event}`);
});

arenaSocket.on("welcome", ({ nickname }) => {
  console.log("프론트 welcome 옴");
  console.log("nickname : ", nickname);
  addNotice(`${nickname}(이)가 방에 입장했습니다.`);
});

arenaSocket.on("enter_host_user", ({ userList, room_host }) => {
  updateArenaNickname(userList, room_host);
});

arenaSocket.on("enter_normal_user", ({ userList, room_host }) => {
  updateArenaNickname(userList, room_host);
});

const updateArenaNickname = (userList, room_host) => {
  userList.forEach((userInfo) => {
    const newUser = document.createElement("div");
    if (room_host == userInfo.CONN_USER) {
      // 들어오는 사람이 방을 만든 사람의 닉네임과 같다면? = 방장일 때
      newUser.className = `c_a_p_u1`;
      newUser.innerHTML += `
      <div class="u_info">
      <div class="u_i_img">방장</div>
      <div class="u_i_nick">${nickname}</div>
      </div>
      <div class="u_remain">
      <div div class="u_r_ques">
      <div class="u_r_circle">ok</div>
      </div>
      </div>
      `;
      const $c_a_p_user = document.querySelector(".c_a_p_user");
      $c_a_p_user.append(newUser);
    } else {
      // 들어오는 사람이 방을 만든 사람의 닉네임과 같다면? = 일반일 때
      newUser.className = `c_a_p_u2`;
      newUser.innerHTML += `
      <div class="u_info">
      <div class="u_i_img">일반</div>
      <div class="u_i_nick">${nickname}</div>
      </div>
      <div class="u_remain">
      <div div class="u_r_ques">
      <div class="u_r_circle">ok</div>
      </div>
      </div>
      `;
      const $c_a_p_user = document.querySelector(".c_a_p_user");
      $c_a_p_user.append(newUser);
    }
  });
};


// arenaSocket.on("user_count", ({ user_count }) => {
//   // console.log(`user_count 이벤트의 사용자 수: ${user_count}`);
//   $c_content_num.textContent = `${user_count}`;
// });

arenaSocket.on("bye", ({ currentNickname }) => {
  console.log("프론트 bye이벤트 옴");
  console.log(`${currentNickname}은 방을 나갔습니다. `);
  addNotice(`${currentNickname}(이)가 방에서 나갔습니다.`);
});

$c_chatting_2_btn.addEventListener("click", handleMessageSubmit);

//--------------------------------------------------------------------------------------------------------------------------------------------
// 페이징 js
const pagination = document.querySelector(".pagination");

if (pagination) {
  const paginationNumbers = document.querySelectorAll(".pagination__number");
  let paginationActiveNumber = document.querySelector(
    ".pagination__number--active"
  );
  const paginationNumberIndicator = document.querySelector(
    ".pagination__number-indicator"
  );
  const paginationLeftArrow = document.querySelector(
    ".pagination__arrow:not(.pagination__arrow--right)"
  );
  const paginationRightArrow = document.querySelector(
    ".pagination__arrow--right"
  );

  const postionIndicator = (element) => {
    const paginationRect = pagination.getBoundingClientRect();
    const paddingElement = parseInt(
      window.getComputedStyle(element, null).getPropertyValue("padding-left"),
      10
    );
    const elementRect = element.getBoundingClientRect();
    paginationNumberIndicator.style.left = `${
      elementRect.left + paddingElement - paginationRect.left
    }px`;
    paginationNumberIndicator.style.width = `${
      elementRect.width - paddingElement * 2
    }px`;
    if (element.classList.contains("pagination__number--active")) {
      paginationNumberIndicator.style.opacity = 1;
    } else {
      paginationNumberIndicator.style.opacity = 0.2;
    }
  };

  const setActiveNumber = (element) => {
    if (element.classList.contains("pagination__number--active")) return;
    element.classList.add("pagination__number--active");
    paginationActiveNumber.classList.remove("pagination__number--active");
    paginationActiveNumber = element;
    setArrowState();
  };

  const disableArrow = (arrow, disable) => {
    if (
      (!disable && !arrow.classList.contains("pagination__arrow--disabled")) ||
      (disable && arrow.classList.contains("pagination__arrow--disabled"))
    )
      return;
    if (disable) {
      arrow.classList.add("pagination__arrow--disabled");
    } else {
      arrow.classList.remove("pagination__arrow--disabled");
    }
  };

  const setArrowState = () => {
    const previousElement = paginationActiveNumber.previousElementSibling;
    const nextElement = paginationActiveNumber.nextElementSibling;
    if (previousElement.classList.contains("pagination__number")) {
      disableArrow(paginationLeftArrow, false);
    } else {
      disableArrow(paginationLeftArrow, true);
    }

    if (nextElement.classList.contains("pagination__number")) {
      disableArrow(paginationRightArrow, false);
    } else {
      disableArrow(paginationRightArrow, true);
    }
  };

  paginationLeftArrow.addEventListener("click", () => {
    setActiveNumber(paginationActiveNumber.previousElementSibling);
    postionIndicator(paginationActiveNumber);
  });

  paginationRightArrow.addEventListener("click", () => {
    setActiveNumber(paginationActiveNumber.nextElementSibling);
    postionIndicator(paginationActiveNumber);
  });

  Array.from(paginationNumbers).forEach((element) => {
    element.addEventListener("click", () => {
      setActiveNumber(element);
      postionIndicator(paginationActiveNumber);
    });

    element.addEventListener("mouseover", () => {
      postionIndicator(element);
    });

    element.addEventListener("mouseout", () => {
      postionIndicator(paginationActiveNumber);
    });
  });

  postionIndicator(paginationActiveNumber);
}

// 페이지 view js
document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 10;
  let currentPage = 1;
  let filteredItems = [];

  function showItems(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    filteredItems.forEach((item, index) => {
      if (index >= startIndex && index < endIndex) {
        item.style.display = "table-row";
      } else {
        item.style.display = "none";
      }
    });
  }

  function handlePagination(page) {
    currentPage = page;
    showItems(currentPage);
    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const paginationButtons = document.querySelectorAll(".pagination__number");
    paginationButtons.forEach((button) => {
      if (parseInt(button.textContent) === currentPage) {
        button.classList.add("pagination__number--active");
      } else {
        button.classList.remove("pagination__number--active");
      }
    });
  }

  const paginationButtons = document.querySelectorAll(".pagination__number");
  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = parseInt(this.textContent);
      handlePagination(page);
    });
  });

  const paginationArrows = document.querySelectorAll(".pagination__arrow");
  paginationArrows.forEach((arrow) => {
    arrow.addEventListener("click", function () {
      const isRightArrow = this.classList.contains("pagination__arrow--right");
      if (isRightArrow) {
        currentPage++;
      } else {
        currentPage--;
      }

      if (currentPage < 1) currentPage = 1;
      const maxPage = Math.ceil(filteredItems.length / itemsPerPage);
      if (currentPage > maxPage) currentPage = maxPage;

      handlePagination(currentPage);
    });
  });

  const items = document.querySelectorAll("#board-list tbody tr");
  items.forEach((item) => {
    item.style.display = "table-row";
    filteredItems.push(item);
  });

  showItems(currentPage);
});

// 팝업창 js
function openModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

// 페이지 전환 js
// $(document).on('click', 'table th a', function (e) {
//   $(".code_arena_zip").css("display", "block");
// });

// function closeModal() {
//   var modal = document.getElementById("modal");
//   modal.style.display = "none";
// }

// 지훈 javaScript 추가

// 배너 클릭 시, 메인으로
$("#m_btn").on("click", () => {
  window.location.href = `${window.location.origin}/page`;
});

// Code Chat 클릭시 메인 -> Code Chat 이동
$("#chat_btn").on("click", () => {
  window.location.href = `${window.location.origin}/page/CodeChat/`;
});

// Code Arena 클릭시 메인 -> Code Arena 이동
$("#arena_btn").on("click", () => {
  window.location.href = `${window.location.origin}/page/CodeArena`;
});

// login 클릭시 login 창 이동
$("#login_btn").on("click", () => {
  window.location.href = `${window.location.origin}/page/join`;
});

// Code Arena Code Editor -----지훈--------

// code arena  -------설아---------

// 타이머 기능 구현 추가
const Timer = document.getElementById("timer"); //스코어 기록창-분
const Timer_zip = document.getElementById("c_a_above1"); //스코어 기록창-분

let time = 600000;
let min = 10;
let sec = 60;

Timer.value = min + ":" + "00";

function TIMER() {
  PlAYTIME = setInterval(function () {
    time = time - 1000; //1초씩 줄어듦
    min = time / (60 * 1000); //초를 분으로 나눠준다.

    if (sec > 0) {
      //sec=60 에서 1씩 빼서 출력해준다.
      sec = sec - 1;
      // sec이 10보다 작을 때 '0'을 붙여서 2자리 형식으로 만들어줍니다.
      Timer.value = Math.floor(min) + ":" + (sec < 10 ? "0" : "") + sec;

      // sec이 10보다 작고 0보다 크거나 같을 때, 즉 10초가 남았을 때 CSS 변경
      if (min == 0) {
        if (sec <= 10 && sec > 0) {
          // 여기에 원하는 CSS 변경 코드를 추가합니다.
          Timer_zip.style.boxShadow = "1px 0px 12px 8px red"; // 예시로 글자 색상을 빨간색으로 변경
          Timer_zip.style.animation = "blink 1s infinite";
        } else {
          // 원하는 CSS 초기 상태를 설정합니다.
          Timer_zip.style.boxShadow = "1px 0px 12px 8px white"; // 예시로 글자 색상을 기본으로 변경
          Timer_zip.style.animation = "none";
        }
      }
    }
    if (sec === 0) {
      // 0에서 -1을 하면 -59가 출력된다.
      // 그래서 0이 되면 바로 sec을 60으로 돌려주고 value에는 0을 출력하도록 해준다.
      sec = 60;
      Timer.value = Math.floor(min) + ":" + "00";
    }
  }, 1000); //1초마다
}

TIMER();
setTimeout(function () {
  clearInterval(PlAYTIME);
}, 600000); //600000
