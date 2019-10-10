"use strict";
/**
 * Created by JK
 * date: 2018-11-09
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
}
//서버 초기 셋팅 완료
Event.SERVERREADY = "serverready";
//로그인 관련
Event.LOGIN = "login";
Event.LOGINSUCCESS = "loginsuccess";
Event.LOGINFAILED = "loginfailed";
Event.LOGOUT = "logout";
//게시판 리스트 관련
Event.GETBOARDLIST = "getboardlist";
Event.GETBOARDLISTCOMPLETE = "getboardlistcomplete";
//게시글 입력 관련
Event.INSERTPAGELOAD = "insertpageload";
Event.INSERTPROCESS = "insertprocess";
Event.INSERTCOMPLETE = "insertcomplete";
//게시글 삭제
Event.DELETEBOARDONE = "deleteboardone";
Event.DELETECOMPLETE = "deletecomplete";
//게시글 보기
Event.BOARDDETAIL = "boarddetail";
Event.BOARDDETAILCOMPLETE = "boarddetailcomplete";
//게시글 수정
Event.BOARDEDIT = "boardedit";
Event.BOARDEDITCOMPLETE = "boardeditcomplete";
exports.Event = Event;
//# sourceMappingURL=Event.js.map