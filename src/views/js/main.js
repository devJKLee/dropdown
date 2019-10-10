
Kakao.init('3668a0d373fefeafe3240923d124338d');
Kakao.Link.createDefaultButton({
    container : '#shareKakao',
    objectType: 'feed',
    content   : {
        title   : '아이엠폼 파일 공유 시스템',
        imageUrl: 'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
        link    : {
            mobileWebUrl: 'http://115.22.171.168:3000/download?guid=<%= guid %>',
            webUrl      : 'http://115.22.171.168:3000/download?guid=<%= guid %>'
        }
    }
});