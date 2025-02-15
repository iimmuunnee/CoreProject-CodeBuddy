# 광주인공지능사관학교4기 JS 특화과정 핵심역량프로젝트
# TeamProject-CodeBuddy
개발 입문자를 위한 실시간 스터디 서비스

<br/>


## ✏️ 프로젝트 소개
클라이언트와 서버간에 실시간 양방향 통신을 가능하게하는 JavaScript 라이브러리 **Socket.io**를 활용해 <br/>
사용자간에 **실시간으로 코드공유**가 가능하고, 백준, 프로그래머스와 같은 **알고리즘 문제풀이를 게임화** 하여 <br/>
사용자들끼리 대결하는 방식을 채택해 공부와 재미 요소를 동시에 결합하였습니다.

### 🎥 시연영상
![코드버디 시연GIF](https://github.com/asdfgl98/Project-CodeBuddy/assets/83624652/9b5dfa73-168b-4ed0-9306-c15e50b63691)<br/>
<a href="https://youtu.be/KVuhtuZ7f8U">Youtube에서 시연영상보기</a>


<br/>

## ⏱️ 프로젝트 기간(기획 ~ 발표준비)
* 23.07.12일 - 23.08.18 (약 1달)

<br/>

## 🧑‍🤝‍🧑 팀원 및 역할
 * 팀원 : 임휘훈(BE) - 실시간 통신 (Socket.io) 및 채팅 기능 구현, CodeArena 사용자간의 상태 실시간 변화 구현, 백엔드 서버 연결
 * 팀원 : 박지훈(BE) - DataBase 설계 및 작성, Code Editor 기능 구현, 실시간 코드전송 및 채팅방 목록 업데이트 기능 구현, 사용자가 작성한 알고리즘 문제풀이 검증 로직 구현
 * 팀장 : 전설아(FE) - CodeArena 페이지 제작, 채팅 모달창 제작, PPT 제작
 * 팀원 : 조명성(FE) - CodeChat 페이지 제작, 프로젝트 발표 
 * 팀원 : 장민혁(FE) - 회원가입 페이지 제작, 로그인 페이지 제작, 채팅방 목록 페이지 제작
 

<br/>

## ⚙️ 개발 환경
- **FE** : `HTML` `CSS` `JavaScript`
- **BE**  : `Node.js`
- **IDE** : Visual Studio
- **Framework** : Express.js
- **Database** : MySQL
- **주요 Library** : Socket.io, CodeMirror, axios

<br/>

## 📌 구현 기능

#### 메인 페이지 - <a href="https://github.com/asdfgl98/Project-CodeBuddy/wiki/1.-Main-Page" target="_blank">상세보기</a>
- Session 값 유무에 따른 서비스 이용 제한 및 Login 탭 정보 변경

#### 회원가입 - <a href="https://github.com/asdfgl98/Project-CodeBuddy/wiki/2.-Join" target="_blank">상세보기</a>
- axios로 DB에 있는 ID 중복 체크 검증

#### 로그인 - <a href="https://github.com/asdfgl98/Project-CodeBuddy/wiki/3.-Login" target="_blank">상세보기</a>
- axios로 DB에 접근하여 ID 및 PW 검증 후 로그인 처리
- 로그인 시 세션(Session) 생성

#### CodeChat/Arena 공통 기능 - <a href="https://github.com/asdfgl98/Project-CodeBuddy/wiki/4.-Code-Arena,-Code-Chat-%EA%B3%B5%ED%86%B5" target="_blank">상세보기</a>
- Socket.io의 NameSpace를 사용해 하나의 서버에서 두 가지의 서버로 분리
- 채팅방 List 실시간으로 최신화/방 생성/방 삭제 적용
- 사용자간의 실시간 채팅 기능

#### CodeChat - <a href="https://github.com/asdfgl98/Project-CodeBuddy/wiki/5.Code-Chat" target="_blank">상세보기</a>
- CodeMirror 라이브러리를 활용하여 웹페이지상 Code Editor 구현
- Socket.io로 실시간 통신을 통해 사용자간에 작성한 Code 전송 기능 구현

#### CodeArena - <a href="https://github.com/asdfgl98/Project-CodeBuddy/wiki/6.-Code-Arena" target="_blank">상세보기</a>
- 백준, 프로그래머스와 같은 알고리즘 문제 풀이를 게임형식으로 재구성
- 다른 사용자들과 실시간으로 알고리즘 풀이를 하면서 재미와 공부 두 가지 요소를 결합

<br/>

## 🚫트러블슈팅
### #1
- 문제#1 : 채팅방 입장 시 socket이 재연결되는 현상 발생
- 원인#1 : 채팅방 입장 시 페이지가 이동되며 새로고침 되면서 socket 재연결
- 해결#1 : React의 SPA를 활용하면 간단히 해결될 문제였지만, 프로젝트 진행 당시 React를 공부하지 않았기에 채팅방 입장 시 페이지 이동이 아닌 요소의 display를 none, block 처리하여 해결

### #2
- 문제#2 : forEach문으로 생성한 채팅방 리스트 클릭 시 EventListener 버블링 현상으로 여러번 클릭되는 현상 발생
- 원인#2 : 채팅방 리스트를 생성할 때 각 채팅방(tr태그)에 대해 개별적으로 이벤트 핸들러를 등록
- 해결#2 : table 전체에 EventListener를 한번 등록하고, 클릭된 요소가 방 번호와 동일할 때 실행되도록 코드수정
