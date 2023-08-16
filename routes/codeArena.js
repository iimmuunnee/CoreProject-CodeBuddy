const express = require("express");
const router = express.Router();

// 데이터베이스 연결
const db = require("../config/database");
const { stringify } = require("qs");
let conn = db.init();

// 방 생성시 생성한 사용자 정보 응답
router.get("/createRoom", (req, res) => {
  let checkEnd = req.session.userName;
  res.send(JSON.stringify(checkEnd));
});

// 유저 접속시 인원수 카운트 증가
router.post("/enterRoom", (req, res) => {
  let checkEnd = req.session.userName;
  let roomNum = req.body.roomNum;
  console.log("실행되나?", roomNum);
  let sql =
    "UPDATE TB_ARENAROOM SET USER_COUNT = USER_COUNT+1 WHERE ROOM_NUMBER=?;";
  let conutSql = "SELECT * FROM TB_ARENAROOM;";
  conn.connect();
  conn.query(sql, [roomNum], (err, result) => {
    if (err) {
      console.log("유저수 카운트 추가 쿼리문 에러");
    } else {
      conn.query(conutSql, (err, result) => {
        if (err) {
          console.log("실패");
        } else {
          res.json(JSON.stringify({ result: result, name: checkEnd }));
        }
      });
    }
  });

  // res.send(JSON.stringify(checkEnd))
});

// 방에서 유저 접속 종료시 카운트 감소
router.post("/leave", (req, res) => {
  let roomNum = req.body.data.room_number;
  let sql =
    "UPDATE TB_ARENAROOM SET USER_COUNT = USER_COUNT-1 WHERE ROOM_NUMBER=?;";
  let conutSql = "SELECT * FROM TB_ARENAROOM;";
  let deleteRoom = "DELETE FROM TB_ARENAROOM WHERE USER_COUNT=0";
  conn.connect();
  conn.query(sql, [roomNum], (err, result) => {
    if (err) {
      console.log("유저수 카운트 감소 쿼리문 에러");
    } else {
      conn.query(deleteRoom, (err, result) => {
        if (err) {
          console.log("채팅방 행 삭제 쿼리문 에러", err);
          conn.query(conutSql, (err, result) => {
            if (err) {
              console.log("실패");
            } else {
              res.json(JSON.stringify({ result: result }));
            }
          });
        } else {
          conn.query(conutSql, (err, result) => {
            if (err) {
              console.log("실패");
            } else {
              res.json(JSON.stringify({ result: result }));
            }
          });
        }
      });
    }
  });
});

// 방 생성시 방 정보 database에 저장
router.post("/updateroom", (req, res) => {
  let roomInfo = req.body.updateRooms[0];
  let number = roomInfo.room_number;
  let name = roomInfo.room_name;
  let method = roomInfo.chatRoomMethod;
  let lang = roomInfo.dev_lang;
  let host = roomInfo.createdBy;
  let count = roomInfo.userCount;

  let sql =
    "INSERT INTO TB_ARENAROOM (ROOM_NUMBER, ROOM_NAME, ROOM_LANG, ROOM_HOST, USER_COUNT) VALUES(?,?,?,?,?)";
  let findRoom = "SELECT * FROM TB_ARENAROOM WHERE ROOM_NUMBER =?";
  conn.connect();
  conn.query(sql, [number, name, lang, host, count], (err, result) => {
    if (err) {
      console.log("방생성 쿼리문 오류", err);
    } else {
      conn.query(findRoom, [number], (err, result) => {
        res.json(JSON.stringify(result[0]));
      });
    }
  });
});

// arena namespace 입장시 요청
router.get("/arenaList", (req, res) => {
  let sql = "SELECT * FROM TB_ARENAROOM;";

  conn.connect();
  conn.query(sql, (err, result) => {
    // console.log('이거도보자',result)
    res.json(JSON.stringify(result));
  });
});

//채팅방에 유저 연결시 인원수 증가
router.post("/connectUser", (req, res) => {
  let userName = req.session.userName;
  let roomNum = req.body.roomNum;
  console.log(roomNum);
  let sql = "INSERT INTO ARENA_USER (ROOM_NUMBER, CONN_USER) VALUES(?,?);";
  let sql2 = "SELECT * FROM ARENA_USER;";
  conn.connect();
  conn.query(sql, [roomNum, userName], (err, result) => {
    if (err) {
      console.log("유저이름 추가 쿼리문 에러", err);
    } else {
      conn.query(sql2, (err, result) => {
        if (err) {
          console.log("테이블 불러오기 실패");
        } else {
          res.json(JSON.stringify(result));
        }
      });
    }
  });
});

router.post("/readyCount", (req, res) => {
  let roomNum = req.body.roomNum;
  let isReady = "Y";
  console.log("readyCount의 방 번호", roomNum);
  let sql =
    "SELECT COUNT(*) AS COUNT FROM ARENA_USER WHERE ROOM_NUMBER = ? AND USER_READY = ?";
  conn.connect();
  conn.query(sql, [roomNum, isReady], (err, result) => {
    if (err) {
      console.log("/readyCount sql 쿼리문 오류");
    } else {
      res.json(JSON.stringify(result));
    }
  });
});

// 채팅방에서 유저 이탈시 인원수 감소
router.post("/disconnectUser", (req, res) => {
  let data = req.body.data;
  let userName = data.user_name;
  let roomNum = data.room_number;
  let sql = "DELETE FROM ARENA_USER WHERE CONN_USER=? AND ROOM_NUMBER =?;";
  let sql2 = "SELECT * FROM ARENA_USER;";
  conn.connect();
  conn.query(sql, [userName, roomNum], (err, result) => {
    if (err) {
      console.log("삭제 쿼리문 오류", err);
    } else {
      conn.query(sql2, (err, result) => {
        if (err) {
          console.log("에바지");
        } else {
          res.json(JSON.stringify(result));
        }
      });
    }
  });
});

// Code Arena 코드 실행 버튼 클릭 시 문제에 대한 입출력값 반환
router.post("/codeStart", (req, res) => {
  let sql = "SELECT * FROM TB_RESULT;";
  conn.connect();
  conn.query(sql, (err, result) => {
    if (err) {
      console.log("정답확인 쿼리문 에러");
    } else {
      res.json(JSON.stringify(result));
    }
  });
});

router.post("/codeReady", (req, res) => {
  let data = req.body.data;
  let roomNum = data.roomNum;
  let nickName = data.nickName;
  console.log("코드레디", roomNum, nickName);
  console.log("/codeReady의 data", data);
  let sql = "SELECT * FROM ARENA_USER WHERE ROOM_NUMBER = ? AND CONN_USER = ?";
  let sqlY =
    "UPDATE ARENA_USER SET USER_READY = 'Y' WHERE ROOM_NUMBER = ? AND CONN_USER = ?";
  let sqlN =
    "UPDATE ARENA_USER SET USER_READY = 'N' WHERE ROOM_NUMBER = ? AND CONN_USER = ?";

  conn.connect();
  conn.query(sql, [roomNum, nickName], (err, result) => {
    if (err) {
      console.log("READY SELECT 에러");
    } else {
      console.log("ready : ", result);
      if (result[0].USER_READY == "N") {
        conn.query(sqlY, [roomNum, nickName], (err, result) => {
          if (err) {
            console.log("ready 변경 쿼리 에러", err);
          } else {
            console.log("Y로 변경 성공");
            conn.query(sql, [roomNum, nickName], (err, result) => {
              if (err) {
                console.log("ready 변경 후 select 에러");
              } else {
                res.json(JSON.stringify(result));
                console.log("11111111111111", result);
              }
            });
          }
        });
      } else {
        conn.query(sqlN, [roomNum, nickName], (err, result) => {
          if (err) {
            console.log("ready 변경 쿼리 에러", err);
          } else {
            console.log("N로 변경 성공");
            conn.query(sql, [roomNum, nickName], (err, result) => {
              if (err) {
                console.log("ready 변경 후 select 에러");
              } else {
                res.json(JSON.stringify(result));
                console.log("222222222222", result);
              }
            });
          }
        });
      }
    }
  });
});

// 코드 아레나 방 유저 인원수 제한 하기위해 유저수 가져오기
router.post("/userFull", (req, res) => {
  console.log("룸넘버 : ", req.body.roomNumber);
  let roomNum = req.body.roomNumber
  let sql = "SELECT USER_COUNT FROM TB_ARENAROOM WHERE ROOM_NUMBER = ?"
  conn.connect()
  conn.query(sql, [roomNum], (err, result) => {
    if (err) {
      console.log("유저 카운트 쿼리문 에러");
    }
    else{
      console.log("가져와지나아아앙", result);
      res.json(JSON.stringify(result[0]))
    }
  })
});

module.exports = router;
