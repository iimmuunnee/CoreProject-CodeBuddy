const getCurrentURL = () => {
  return window.location.href;
}
const getNamespaceFromURL = (url) => {
  if (url.includes("CodeArena")){
    return "/CodeArena"
  }
}

const currentURL = getCurrentURL();
const namespace = getNamespaceFromURL(currentURL)
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
const $c_a_u_r_name2 = document.querySelector(".c_a_u_r_name2")

const openarena = () => {
  let page = document.getElementById("code_arena_zip");
  page.style.display = "block";

  let page2 = document.getElementById("notice");
  page2.style.display = "none";

  let chat = document.getElementById("chat_open");
  chat.style.display = "block";
};

// 방 생성 함수
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const room_name = $room_name.value;
  const dev_lang = $dev_lang.value;
  // 지훈 코드 삽입 (방생성)
  axios.get("http://localhost:3000/room/createRoom", { room: "hi" })
  .then((res) => {
    currentNickname = res.data;
    arenaSocket.emit("create_room", {
      room_name: room_name,
      dev_lang: dev_lang,
      nickname: res.data, // 사용자 이름
    });
    
    
      closeModal(); // 모달 닫고
      openarena(); // 방 입장
      arenaSocket.emit("welcome", { nickname: res.data });
      $room_name.value = ""; // 방 입력칸 초기화
    });

  $c_c_name.textContent = room_name; // 채팅방 펼쳤을 때 방제
  $mini_room_name.textContent = room_name; // 채팅방 접었을 때 방제
  $c_a_u_r_name2.textContent = room_name // Arena 제한 시간 위 방제
};

arenaSocket.on("user_count", ({ user_count }) => {
  console.log("user_count 이벤트 도착"), user_count;
  $c_content_num.textContent = `${user_count}/4`;
  $mini_room_users.textContent = `${user_count}/4`;
});

// 방목록 최신화 ------------------지훈---------------------

const clickEvent = ()=>{
  
}


let currentNickname = "";
let roomName
let roomNum
let roomLinks
let clickEventHandler = null;
//최신화 함수

const updateArenaRoom = (roomList)=>{  
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $tr = $tbody.querySelector("tr");
  // $tr.remove();
  // roomList는 현재 생성된 객체 형태의 방 정보들을 배열에 담김
  // roomInfo는 현재 생성된 객체 형태의 방 정보
  roomList.forEach((roomInfo) => {
    const newRow = document.createElement("tr");
    newRow.id = "room_" + roomInfo.ROOM_NUMBER;
    // 방 정보를 td에 추가
    newRow.innerHTML = `
            <td id="room-Num">${roomInfo.ROOM_NUMBER}</td>
            <td>${roomInfo.chatRoomMethod}</td>
            <td>${roomInfo.ROOM_LANG}</td>
            <th>
              <a id='123' class="room-link room-${roomInfo.ROOM_NUMBER}" data-roomnumber="${roomInfo.ROOM_NUMBER}" data-roomname="${roomInfo.ROOM_NAME}">${roomInfo.ROOM_NAME}</a>
              <p>테스트</p>
             </th>
            <td>${roomInfo.HOST}</td>
            <td>${roomInfo.USER_COUNT}/4</td>
      `;
    // 새로운 행을 테이블의 맨 위에 추가
    $tbody.prepend(newRow);
    roomName = roomInfo.ROOM_NAME // 방 제목 가져오기
    roomNum = roomInfo.ROOM_NUMBER // 방 번호 가져오기
    axios.get("http://localhost:3000/room/createRoom", { room: "hi" })
    .then((res) => {
      currentNickname = res.data 
    })
    $tbody.addEventListener("click", (e) => {
      if (e.target.className === `room-link room-${roomInfo.ROOM_NUMBER}`){
        enterRoom(currentNickname, roomInfo.ROOM_NAME, roomInfo.ROOM_NUMBER)
      }
    })
  })
}

// arenaSocket.on("connect", () => {
//   console.log("프론트와 서버와의 연결 성공");
// });

// 사용자 접속시 채팅방 리스트 최신화
arenaSocket.on('updateRoomList', (roomList)=>{
  
  updateArenaRoom(roomList)
})

// 방 생성시 채팅방 리스트 최신화(기존의 테이블 tr 모두 삭제 후 최신화)
arenaSocket.on('updateRoomList2', (roomList)=>{
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  $trs.forEach($tr => {
    $tr.remove();
  });
  updateArenaRoom(roomList)
})


// 인원수 실시간 업데이트
arenaSocket.on('countUpdate',(data)=>{
  const $board_list = document.getElementById("board-list");
  const $board_table = $board_list.querySelector(".board-table");
  const $tbody = $board_table.querySelector("tbody");
  const $trs = $tbody.querySelectorAll("tr");
  $trs.forEach($tr => {
    $tr.remove();
  });
  updateArenaRoom(data.data)
})


// --------------------지훈 끝--------------------------------
//
$make_room_form.addEventListener("submit", handleRoomSubmit);

arenaSocket.on("update_room_list", (roomInfo) => {
  console.log("roomInfo : ", roomInfo);
  // updateRoomList(roomInfo);
  addRoomToTable(roomInfo)
  });

// //방 목록 database에 새로운 방 추가하는 함수
const addRoomToTable = (updateRooms) => {
  axios.post('/room/updateroom', {updateRooms})
    .then(res=>{
      let roomInfo = JSON.parse(res.data)
      arenaSocket.emit('newlist')
  });
};


const enterRoom = (currentNickname, roomName, roomNum) => {
  console.log("enterRoom 실행");
  console.log("enterRoom 함수의 currentNickname : ", currentNickname);
  axios.post("http://localhost:3000/room/enterRoom", {roomNum})
  .then(res => {
    let data = JSON.parse(res.data)
    currentNickname = data.name;
    arenaSocket.emit("enter_room", {
      room_name: roomName,
      nickname: data.name,
      room_number : roomNum
    });
    arenaSocket.emit('userCount',{data:data.result})
  })

  $c_c_name.textContent = roomName; // 채팅방 펼쳤을 때 방제
  $mini_room_name.textContent = roomName; // 채팅방 접었을 때 방제
  $c_a_u_r_name2.textContent = roomName // Arena 제한 시간 위 방제

  arenaSocket.on("user_count", ({ user_count }) => {
    console.log("user_count 이벤트 도착");
    console.log(user_count);
    $c_content_num.textContent = `${user_count}/4`;
    $mini_room_users.textContent = `${user_count}/4`;
  });

  arenaSocket.emit("welcome", { nickname: currentNickname });
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
  
 
  arenaSocket.emit("leave_room");
  location.reload();
};

$leave_room.addEventListener("click", leaveRoomBtn);

arenaSocket.on("disconnect", () => {
  console.log("disconnect to server");
});

// -------------------------리스트 페이지 끝 -----------CodeArena 페이지 시작---------------------------------------------------------------------
const $c_main_content = $chat_main.querySelector(".c_main_content"); // 채팅 내용이 들어갈 곳
const $c_chatting = $chat_main.querySelector(".c_chatting"); // 채팅작성 및 전송
const $c_chatting_form = $c_chatting.querySelector(".c_chatting_form"); // 채팅 작성 form
const $form_input = $c_chatting_form.querySelector("#form_input"); // 채팅 작성 form의 input
const $c_chatting_2 = $c_chatting_form.querySelector(".c_chatting_2")
const $c_chatting_2_btn = $c_chatting_2.querySelector(".c_chatting_2_btn")

// 공지
const addNotice = (message) => {
  console.log("addNotice 함수 실행");
  const $div = document.createElement("div");
  console.log("message : ", message);
  $div.textContent = message;
  $c_main_content.appendChild($div);
};

const handleMessageSubmit = (event) => {
  console.log("handleMessageSubmit 함수 실행")
  event.preventDefault();
  const message = $form_input.value; // 메시지 입력값 가져오기
  console.log("메세지 핸들러, 메세지 : ", message);
  console.log("userInfo : ", currentNickname);

  arenaSocket.emit(
    "new_message",
    {currentNickname, message: message}
  )

  $form_input.value = ""; // 입력 창 초기화
};
// ---------------함수 정의 끝------------------

arenaSocket.on("connect", () => {
  console.log("프론트와 서버와의 연결 성공");
});

arenaSocket.on("new_message", ({ currentNickname, message }) => {
  console.log("new_message이벤트 프론트에서 받음");
  const $div = document.createElement("div");
  $div.textContent = `${currentNickname} : ${message}`
  $c_main_content.appendChild($div);

  // Chat.sendMessage(currentNickname, message);
});

// 프론트로 온 이벤트 감지
arenaSocket.onAny((event) => {
  console.log(`arenaSocket Event: ${event}`);
});

arenaSocket.on("welcome", ({nickname}) => {
  console.log("프론트 welcome 옴");
  console.log("nickname : ",nickname);
  addNotice(`${nickname}(이)가 방에 입장했습니다.`);
});

arenaSocket.on("user_count", ({ user_count }) => {
  console.log(`user_count 이벤트의 사용자 수: ${user_count}`);
  $c_content_num.textContent = `${user_count}`;
});

arenaSocket.on("bye", ({currentNickname}) => {
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
