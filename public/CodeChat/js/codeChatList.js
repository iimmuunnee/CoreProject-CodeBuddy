// socket.io 사용
const chatSocket = io("/CodeChat");
// 방의 이름을 입력받고 방에 입장할 수 있는 페이지 담당 js

const $make_room_form = document.querySelector("#make_room_form"); // 방 정보 입력 폼
const $room_name = document.getElementById("room_name"); // 방 이름 입력 input
const $dev_lang = document.getElementById("dev_lang"); // 방의 언어 방식 select
const $chatRoomMethod = document.getElementById('chatRoomMethod')

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

const openarena = (user) => {
  $("#container").css("display", "flex");
  $(".m_header").css("display", "none");
  $('.notice').css("display", "none");
  $('.chat_open').css('display', 'block')
};

let currentNickname;
// 방 생성 함수
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const room_name = $room_name.value;
  const dev_lang = $dev_lang.value;
  const chatRoomMethod = $chatRoomMethod.value;
  // 지훈 코드 삽입 (방생성)
  axios.get("/codeChat/createRoom", { room: "hi" }).then((res) => {
    currentNickname = res.data; // 방 생성자의 닉네임
    chatSocket.emit("create_room", {
      room_name: room_name,
      dev_lang: dev_lang,
      nickname: res.data, // 방 생성자 이름
      chatRoomMethod : chatRoomMethod, 
    });

    chatSocket.emit("check_admin", { nickname: res.data });

    closeModal(); // 모달 닫고
    // openarena(); // 방 입장
    // chatSocket.emit("welcome", { nickname: res.data });
    $room_name.value = ""; // 방 입력칸 초기화
  });

  $c_c_name.textContent = room_name; // 채팅방 펼쳤을 때 방제
  $mini_room_name.textContent = room_name; // 채팅방 접었을 때 방제
  // $c_a_u_r_name2.textContent = room_name; // Arena 제한 시간 위 방제
};

// 방 생성시 방장 권한 부여
chatSocket.on("admin_status", ({ isAdmin }) => {
  console.log("admin_status", isAdmin);
  if (isAdmin) {
    console.log("이 방의 방장입니다!");
    chatSocket["isAdmin"] = isAdmin;
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
            <td>${roomInfo.ROOM_METHOD}</td>
            <td class="item ${roomInfo.ROOM_LANG}">${roomInfo.ROOM_LANG}</td>
            <th>
              <a align='center' id='123' class="room-link room-${roomInfo.ROOM_NUMBER}" data-roomnumber="${roomInfo.ROOM_NUMBER}" data-roomname="${roomInfo.ROOM_NAME}" data-roomhost="${roomInfo.ROOM_HOST}">${roomInfo.ROOM_NAME} ( ${roomInfo.USER_COUNT} / 4 )</a>
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

// chatSocket.on("connect", () => {
//   console.log("프론트와 서버와의 연결 성공");
// });

// 사용자 접속시 채팅방 리스트 최신화
chatSocket.on("updateRoomList", () => {
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  axios.get("/codeChat/arenaList", { re: "hi" }).then((res) => {
    let roomList = JSON.parse(res.data);
    // console.log("roomList : ", roomList);
    $trs.forEach(($tr) => {
      $tr.remove();
    });
    updateArenaRoom(roomList);
  });
});

// 방 생성시 채팅방 리스트 최신화(기존의 테이블 tr 모두 삭제 후 최신화)
chatSocket.on("updateRoomList2", () => {
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  axios.get("/codeChat/arenaList", { re: "hi" }).then((res) => {
    let roomList = JSON.parse(res.data);
    $trs.forEach(($tr) => {
      $tr.remove();
    });
    updateArenaRoom(roomList);
  });
});

// 인원수 실시간 업데이트
chatSocket.on("countUpdate", (data) => {
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
chatSocket.on("host_enterRoom", (data) => {
  let nickName = data[0].createdBy;
  let roomName = data[0].room_name;
  let roomNum = data[0].room_number;
  const addRoomToTable = (updateRooms) => {
    axios.post("/codeChat/updateroom", { updateRooms }).then((res) => {
      let roomInfo = JSON.parse(res.data);
    });
  };
  addRoomToTable(data);
  enterRoom(roomName, roomNum, nickName);
});

// 코드 보내기 클릭
const codeSend = document.querySelector('#codeSend')
codeSend.addEventListener('click',()=>{
  // console.log('내html',html.getValue())
  // console.log('내css',css.getValue())
  // console.log('내js',js.getValue())
  let myHtml = html ? html.getValue() : '';
  let myCss = css ? css.getValue() : '';
  let myJs = js ? js.getValue() : '';
  chatSocket.emit('codeSendBtn', {html : myHtml, css : myCss, js : myJs})
})

//코드 유저에게 전송
chatSocket.on('codeSend',(data)=>{
  console.log('보자',data)
  html2.setValue(data.html)
  css2.setValue(data.css)
  js2.setValue(data.js)
})

// --------------------지훈 끝--------------------------------
//
$make_room_form.addEventListener("submit", handleRoomSubmit);

chatSocket.on("update_room_list", (roomInfo) => {
  // console.log("roomInfo : ", roomInfo);
  // updateRoomList(roomInfo);
  addRoomToTable(roomInfo);
});

// //방 목록 database에 새로운 방 추가하는 함수
const addRoomToTable = (updateRooms) => {
  axios.post("/codeChat/updateroom", { updateRooms }).then((res) => {
    let roomInfo = JSON.parse(res.data);
    chatSocket.emit("newlist");
  });
};

let conn_user_data;
const enterRoom = (roomName, roomNum, roomHost) => {
  console.log("enterRoom 실행");
  // console.log("enterRoom 함수의 currentNickname : ", currentNickname);
  //휘훈아!!!!!!!!!!!!!!!!!!!!! 유저접속
  axios.post("/codeChat/connectUser", { roomNum }).then((res) => {
    conn_user_data = JSON.parse(res.data);
    console.log("가져와져랏", conn_user_data);
    // chatSocket.emit("conn_user", data) // 전체 유저가 접속한 방번호와 닉네임 객체
  });

  axios.post("/codeChat/enterRoom", { roomNum }).then((res) => {
    let data = JSON.parse(res.data);
    currentNickname = data.name;
    chatSocket.emit("enter_room", {
      room_name: roomName,
      nickname: data.name,
      room_number: roomNum,
      room_host: roomHost,
      conn_user: conn_user_data,
    });
    chatSocket.emit("userCount", { data: data.result });
  });
  $c_c_name.textContent = roomName; // 채팅방 펼쳤을 때 방제
  $mini_room_name.textContent = roomName; // 채팅방 접었을 때 방제
  // $c_a_u_r_name2.textContent = roomName; // Arena 제한 시간 위 방제

  chatSocket.on("user_count", ({ user_count }) => {
    // console.log("user_count 이벤트 도착");
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
  let header = document.getElementById("head");
  header.style.display = "block";


};

let disconn_user_data;
chatSocket.on("leaveuser", (data) => {
  // console.log("leaveuser의 data", data);
  // data안엔 room_number, user_name
  //휘훈아!!!!!!!!!!!!!!!!!!!!! 유저 나감
  axios.post("/codeChat/disconnectUser", { data }).then((res) => {
    disconn_user_data = JSON.parse(res.data);
    // console.log("이거 뭐임?", disconn_user_data);
    chatSocket.emit("disconn_arena_user", { user_data: disconn_user_data });
    // chatSocket.emit("disconn_arena_user", {disconn_user_data})
  });

  axios.post("/codeChat/leave", { data }).then((res) => {
    let data = JSON.parse(res.data);
    chatSocket.emit("userCount", { data: data.result });
    // location.reload();
  });
});

// $leave_room.addEventListener("click", leaveRoomBtn);

// 인원 수 초과 됐을 때
chatSocket.on("user_full", () => {
  alert("방 인원 초과");
});

window.addEventListener("beforeunload", () => {
  chatSocket.emit("leave_count");
  chatSocket.emit("leave_room", { currentNickname });
});

chatSocket.on("disconnect", () => {
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
  // console.log("핸들메세지함수", currentNickname); // 보낸 사람의 닉네임

  chatSocket.emit("new_message", { currentNickname, message: message });

  $form_input.value = ""; // 입력 창 초기화
};
// ---------------함수 정의 끝------------------

chatSocket.on("connect", () => {
  console.log("프론트와 서버와의 연결 성공");
});

chatSocket.on("my_message", ({ currentNickname, message }) => {
  console.log("내 new_message이벤트 프론트에서 받음");
  const $div = document.createElement("div");
  $div.textContent = `(본인)${currentNickname} : ${message}`;
  $c_main_content.appendChild($div);
});

chatSocket.on("other_message", ({ currentNickname, message }) => {
  console.log("다른사람 new_message이벤트 프론트에서 받음");
  const $div = document.createElement("div");
  $div.textContent = `(상대)${currentNickname} : ${message}`;
  $c_main_content.appendChild($div);
});

// 프론트로 온 이벤트 감지
chatSocket.onAny((event) => {
  console.log(`chatSocket Event: ${event}`);
});

chatSocket.on("welcome", ({ nickname }) => {
  console.log("프론트 welcome 옴");
  console.log("nickname : ", nickname);
  addNotice(`${nickname}(이)가 방에 입장했습니다.`);
});

// chatSocket.on("enter_host_user", ({ conn_user, room_host, room_number }) => {
//   const $c_a_p_user = document.querySelector(".c_a_p_user");
//   const $divs = $c_a_p_user.querySelectorAll("div");
//   $divs.forEach(($div) => {
//     $div.remove();
//   });
//   // userList는 전체 유저가 입장한 방번호와 닉네임을 객체로 배열에 넣은 것
//   // console.log("enter_host_user", conn_user);
//   // room_number는 입장하는 방의 번호
//   // console.log("enter_host_user", room_host);
//   // room_host는 입장하는 방을 만든 이
//   // console.log("enter_host_user", room_number);
//   updateArenaNickname(conn_user, room_host, room_number);
// });

// chatSocket.on("enter_normal_user", ({ conn_user, room_host, room_number }) => {
//   const $c_a_p_user = document.querySelector(".c_a_p_user");
//   const $divs = $c_a_p_user.querySelectorAll("div");

//   $divs.forEach(($div) => {
//     $div.remove();
//   });
//   updateArenaNickname(conn_user, room_host, room_number);
// });


// chatSocket.on("leave_normal_user", ({ disconn_arena_user, room_number }) => {
//   // console.log("leave_normal_user");
//   $("div").remove(".c_a_p_u2");
//   updateArenaNickname2(disconn_arena_user, room_number);
// });

chatSocket.on("get_out", () => {
  leaveRoomBtn();
});

const updateArenaNickname = (conn_user, room_host, room_number) => {
  // console.log("conn_user", conn_user);
  const $c_a_p_user = document.querySelector(".c_a_p_user");
  conn_user.forEach((userInfo) => {
    const newUser = document.createElement("div");
    if (userInfo.ROOM_NUMBER == room_number) {
      if (room_host == userInfo.CONN_USER) {
        // 들어오는 사람이 방을 만든 사람의 닉네임과 같다면? = 방장일 때
        newUser.className = `c_a_p_u1`;
        newUser.innerHTML += `
        <div class="u_info">
        <div class="u_i_img">방장</div>
        <div class="u_i_nick">${room_host}</div>
        </div>
        <div class="u_remain">
        <div div class="u_r_ques">
        <div class="u_r_circle" style="display:none;">ok</div>
        </div>
        </div>
        `;
        $c_a_p_user.append(newUser);
      } else {
        // 들어오는 사람이 방을 만든 사람의 닉네임과 같다면? = 일반일 때
        newUser.className = `c_a_p_u2`;
        newUser.innerHTML += `
        <div class="u_info">
        <div class="u_i_img">일반</div>
        <div class="u_i_nick">${userInfo.CONN_USER}</div>
        </div>
        <div class="u_remain">
        <div div class="u_r_ques">
        <div class="u_r_circle" style="display:none;">ok</div>
        </div>
        </div>
        `;
        $c_a_p_user.append(newUser);
      }
    }
  });
};

const updateArenaNickname2 = (conn_user, room_number) => {
  console.log("updateArenaNickname2 함수 실행");
  console.log("conn_user", conn_user);
  const $c_a_p_user = document.querySelector(".c_a_p_user");

  let cnt = 1;
  conn_user.forEach((userInfo) => {
    const newUser = document.createElement("div");
    if (userInfo.ROOM_NUMBER == room_number) {
      if (cnt != 1) {
        // 들어오는 사람이 방을 만든 사람의 닉네임과 같다면? = 일반일 때
        newUser.className = `c_a_p_u2`;
        newUser.innerHTML += `
          <div class="u_info">
          <div class="u_i_img">일반</div>
          <div class="u_i_nick">${userInfo.CONN_USER}</div>
          </div>
          <div class="u_remain">
          <div div class="u_r_ques">
          <div class="u_r_circle" style="display:none;">ok</div>
          </div>
          </div>
          `;
        $c_a_p_user.append(newUser);
      } else {
        cnt++;
      }
    }
  });
};

// chatSocket.on("user_count", ({ user_count }) => {
//   // console.log(`user_count 이벤트의 사용자 수: ${user_count}`);
//   $c_content_num.textContent = `${user_count}`;
// });

chatSocket.on("bye", ({ currentNickname }) => {
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
