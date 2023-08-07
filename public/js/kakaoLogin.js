window.Kakao.init('1a854a52728728015dc620a9bed3df2f');
        function kakaoLogin() {
            Kakao.Auth.login({
                scope: 'profile_nickname,profile_image, account_email, gender, age_range', //동의항목 페이지에 있는 개인정보 보호 테이블의 활성화된 ID값을 넣습니다.
                redirectUri : 'https://localhost:3000/kakao/callback',
                success: function(response) {
                    let token = response.access_token
                    
                    console.log('로그인성공',response) // 로그인 성공하면 받아오는 데이터
                    window.Kakao.API.request({ // 사용자 정보 가져오기 
                        url: '/v2/user/me',
                        success: (res) => {
                            const kakao_account = res;
                            const kakaoId = kakao_account.id
                            console.log(kakaoId)
                            console.log('이건뭐야',kakao_account)
                        }
                    });
                    // window.location.href='/ex/kakao_login.html' //리다이렉트 되는 코드
                },
                fail: function(error) {
                    console.log(error);
                }
            });
        }


    // <!-- 로그아웃 -->
 
        window.Kakao.init('본인 JAVASCRIPT API 키');
	function kakaoLogout() {
    	if (!Kakao.Auth.getAccessToken()) {
		    console.log('Not logged in.');
		    return;
	    }
	    Kakao.Auth.logout(function(response) {
    		alert(response +' logout');
		    window.location.href='/page/join'
	    });
};


// <!-- 회원탈퇴 -->

        function secession() {
	Kakao.API.request({
    	url: '/v1/user/unlink',
    	success: function(response) {
    		console.log(response);
    		//callback(); //연결끊기(탈퇴)성공시 서버에서 처리할 함수
    		window.location.href='/page/user'
    	},
    	fail: function(error) {
    		console.log('탈퇴 미완료')
    		console.log(error);
    	},
	});
};