const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const mime = require("mime");
const session = require("express-session");
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("qs");
// routes 폴더 내 파일 사용
const page = require("./routes/page");
const user = require("./routes/user");
const room = require("./routes/room")
const kakao = require("./routes/kakaoLogin");

// 네임스페이스로 io 서버 분리 /CodeChat, /CodeArena
const ChatNamespace = io.of("/CodeChat");
const ArenaNamespace = io.of("/CodeArena");

// .env 파일 사용
dotenv.config();

// 동적 페이지 사용
const nunjucks = require("nunjucks");
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// 정적 폴더 사용
app.use(express.static("public"));

// post방식 -> body영역 사용등록
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session 사용
app.use(
  session({
    httpOnly: true, // http 통신일때 허용
    secret: "secret", // 암호화 키 process.env.SESSION_SECRET
    resave: false, // 요청이 들어왔을 때 세션에 수정사항이 없더라도 다시저장
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 세션값 쿠키 만료시간 24시간
      secure: false,
    },
  })
);



// --------------------------------- 휘훈 -------------------------------------

// 네임스페이스 사용했기 때문에 파일 경로 지정
app.use(
  "/CodeChat/public/CodeChat",
  express.static(path.join(__dirname, "public/CodeChat"), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.getType(filePath);
      res.setHeader("Content-Type", mimeType);
    },
  })
);

// 네임스페이스 사용했기 때문에 파일 경로 지정
app.use(
  "/CodeArena/public/CodeArena",
  express.static(path.join(__dirname, "public/CodeArena"), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.getType(filePath);
      res.setHeader("Content-Type", mimeType);
    },
  })
  );
  
  app.use("/page", page);
  app.use("/user", user);
  app.use(kakao);
  app.use("/room",room)
  
  // "Chat" namespace에 접속한 클라이언트 처리
  ChatNamespace.on("connection", (socket) => {
    const usedRoomNumbers = new Set(); // 사용된 방 번호를 저장하는 Set
    const rooms = new Map();
    console.log("Chat 네임스페이스에 클라이언트가 연결되었습니다.");
    // console.log("입장하기 전 소켓이 들어간 방", socket.rooms);
  // 함수 정의
  // 방의 인원수를 세는 함수
  // const countRoomUsers = (room_name) => {
  //   return io.sockets.adapter.rooms.get(room_name)?.size;
  // };
  // 방 번호를 생성하는 함수
  const generateRoomNumber = () => {
    let room_number;
    do {
      room_number = Math.floor(Math.random() * 100) + 1; // 1부터 100 사이의 난수 생성
    } while (usedRoomNumbers.has(room_number)); // 중복되는 방 번호가 나오지 않도록 반복

    usedRoomNumbers.add(room_number); // 사용된 방 번호 Set에 추가
    return room_number;
  };

  // 방의 인원수를 세는 함수
  const countRoomUsers = (room_name) => {
    return ChatNamespace.adapter.rooms.get(room_name)?.size || 0;
  };

  // 함수 정의 끝
  socket.onAny((event) => {
    console.log(`backSocket Event: ${event}`);
  });

  socket.on("create_room", ({ room_name, chatRoomMethod, dev_lang,nickname }) => {
    console.log("create_room 이벤트 서버로 도착");
    console.log('닉네임확인',nickname)
    if (chatRoomMethod === "one_to_one") {
      chatRoomMethod = "1:1채팅";
    } else {
      chatRoomMethod = "오픈채팅";
    }

    
    const roomInfo = {
      room_number: generateRoomNumber(),
      room_name: room_name,
      chatRoomMethod: chatRoomMethod,
      dev_lang: dev_lang,
      createdBy: socket.nickname,
      createdDate: new Date().toISOString().slice(0, 10),
    };

    console.log("roomInfo", roomInfo);

    rooms.set(room_name, roomInfo);

    socket.emit("enter_room", {room_name, nickname, roomNum,})
 
    // 업데이트된 방 리스트 전체에 브로드캐스팅
    const updatedRoomList = Array.from(rooms.values());
    console.log("방목록 보여줘 : ", updatedRoomList);
    ChatNamespace.emit("update_room_list", updatedRoomList);
  });

  // 방 입장 enter_room 감지하기
  socket.on(
    "enter_room",
    ({
      room_name,
      nickname,
      roomNum,
    }) => {
      console.log("서버 enter_room 이벤트 활성화");
      // console.log("enter_room의 room_name", room_name);
      console.log("enter_room의 nickname", nickname);

      socket["roomNum"] = roomNum; // 소캣 객체에 "room_name"이라는 속성 추가

      socket.join(roomNum); // 방에 입장하기

      io.of("/CodeChat")
        .to(roomNum)
        .emit("welcome", {
          nickname,
        });
        
      socket.emit("userInfo", {nickname})
      console.log("입장한 후 소켓이 들어간 방", socket.rooms);
      console.log("user_count : ", countRoomUsers(roomNum));

      io.of("/CodeChat")
        .to(room_name)
        .emit("user_count", { user_count: countRoomUsers(roomNum) });
    }
  );

  // 사용자에게 받은 코드에디터 개인코드 전체사용자에게 전송 -지훈-
  socket.on("submit", (data) => {
    io.of("/CodeChat").emit("codeEditor", data);
  });

  socket.on("disconnecting", () => {
    console.log("Chat서버 disconnecting 이벤트 활성화");
    console.log("disconnecting 이후 ", socket.rooms);
  });

  socket.on("disconnect", () => {
    console.log("Chat서버 disconnect 이벤트 활성화");
    console.log("disconnect 이후 ", socket.rooms);
  });
});

// -------------------------------------------------------- CodeArena 시작 ----------------------------------------------------------------------------------

// "Arena" namespace에 접속한 클라이언트 처리
ArenaNamespace.on("connection", (socket) => {
  console.log("Arena 네임스페이스에 클라이언트가 연결되었습니다.");

  const rooms = new Map(); // 방 정보를 저장할 Map
  const usedRoomNumbers = new Set(); // 사용된 방 번호를 저장하는 Set

  // 함수 정의
  // 방 번호를 생성하는 함수
  const generateRoomNumber = () => {
    let room_number;
    do {
      room_number = Math.floor(Math.random() * 100) + 1; // 1부터 100 사이의 난수 생성
    } while (usedRoomNumbers.has(room_number)); // 중복되는 방 번호가 나오지 않도록 반복

    usedRoomNumbers.add(room_number); // 사용된 방 번호 Set에 추가
    return room_number;
  };

// 방의 인원수를 세는 함수
const countRoomUsers = (room_name) => {
  console.log();
  const room = ArenaNamespace.adapter.rooms.get(room_name);
  return room ? room.size : 0;
};


  // 함수 정의 끝
  // 닉네임 설정 받고 다시 보내기

// 지훈 코드 삽입
  axios.get('http://localhost:3000/room/arenaList', {re:'hi'})
  .then(res=>{
    // ArenaNAMEspase.emit("updateRoom",)
    let roomList = JSON.parse(res.data)
    // console.log('방목록',roomList)
    // 방목록 arena로 전달
    socket.emit('updateRoomList', roomList)
  })

  socket.on("create_room", ({ room_name, chatRoomMethod, dev_lang,nickname }) => {
    console.log("create_room 이벤트 서버로 도착");
    // console.log("rooms : ", rooms);
    // console.log('닉넴',nickname)

    if (chatRoomMethod === "one_to_one") {
      chatRoomMethod = "1:1채팅";
    } else {
      chatRoomMethod = "오픈채팅";
    }

    const roomInfo = {
      room_number: generateRoomNumber(),
      room_name: room_name,
      chatRoomMethod: chatRoomMethod,
      dev_lang: dev_lang,
      createdBy: nickname ,
      userCount : countRoomUsers(room_name) + 1,
    };
    // console.log(roomInfo);
    rooms.set(room_name, roomInfo);
    // 업데이트된 방 리스트 전체에 브로드캐스팅
    const updatedRoomList = Array.from(rooms.values());
    console.log("방리스트알려줘", updatedRoomList);
    socket.emit("update_room_list", updatedRoomList);
  });

  socket.on('newlist',()=>{
    axios.get('http://localhost:3000/room/arenaList', {re:'hi'})
      .then(res=>{
        let roomList = JSON.parse(res.data)
        ArenaNamespace.emit('updateRoomList2', roomList)
      })
  })
  
  socket.on('userCount',(data)=>{
    ArenaNamespace.emit('countUpdate',(data))
  })


  // Arena 방 입장 enter_room 감지하기
  socket.on(
    "enter_room",
    ({
      room_name,
      nickname: nickname,
      roomNum
    }) => {
      console.log("서버 enter_room 이벤트 활성화");
      // console.log("enter_room의 room_name", room_name);
      console.log("enter_room의 nickname", nickname);
      
      socket["room_name"] = room_name; // 소캣 객체에 "room_name"이라는 속성 추가

      console.log("enter_room이벤트의 roomNum : ", roomNum);

      socket.join(roomNum); // 방에 입장하기
      const roomInfo = rooms.get(room_name)
      if (roomInfo) {
        roomInfo.userCount = (roomInfo.userCount || 0) + 1;
        rooms.set(room_name, roomInfo);
      }

      ArenaNamespace.to(room_name).emit("welcome", {nickname});

      console.log("입장한 후 소켓이 들어간 방", socket.rooms);
      console.log("countRoomUsers(room_name) : ", countRoomUsers(room_name));

      ArenaNamespace
        .to(room_name)
        .emit("user_count", { user_count: countRoomUsers(room_name)});
    }
  );

  socket.on("new_message", ({currentNickname, message: message,}) => {
    ArenaNamespace.emit("new_message", {currentNickname, message: message,})
    // 방 이름 정보를 가져와서 해결해야함
  })

  socket.on("leave_room", () => {
    const room_name = socket.room_name;
    if (room_name) {
      socket.leave(room_name); // 방에서 퇴장

      const roomInfo = rooms.get(room_name);
      if (roomInfo) {
        roomInfo.userCount--; // 유저 인원수 감소
        if (roomInfo.userCount === 0) {
          rooms.delete(room_name); // 방 삭제
        }
        // 방 정보 갱신하여 방 리스트 업데이트
        const updatedRoomList = Array.from(rooms.values());
        // ArenaNamespace.emit("update_room_list", updatedRoomList);
      }
      socket.room_name = null; // 방 이름 정보 초기화
    }
      console.log("방에서 퇴장한 후 소켓이 들어간 방", socket.rooms);
      console.log("방에서 퇴장한 후 인원 수 : ", countRoomUsers(room_name));
  })
  
  
  socket.on("disconnecting", () => {
    console.log("서버 disconnecting 이벤트 활성화");
  });

  socket.on("disconnet", () => {
    console.log("서버 disconnect 이벤트 활성화");
  });
});

http.listen(3000, function () {
  console.log("Code Buddy server listening on port http://localhost:3000/page");
});
