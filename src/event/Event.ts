/**
 * Created by JK
 * date: 2018-11-09
 */

export class Event
{
    //서버 초기 셋팅 완료
    public static readonly SERVERREADY: string = "serverready";
    //로그인 관련
    public static readonly LOGIN: string = "login";
    public static readonly LOGINSUCCESS: string = "loginsuccess";
    public static readonly LOGINFAILED: string = "loginfailed";
    public static readonly LOGOUT: string = "logout";
    //게시판 리스트 관련
    public static readonly GETBOARDLIST: string = "getboardlist";
    public static readonly GETBOARDLISTCOMPLETE: string = "getboardlistcomplete";
    //게시글 입력 관련
    public static readonly INSERTPAGELOAD: string = "insertpageload";
    public static readonly INSERTPROCESS: string = "insertprocess";
    public static readonly INSERTCOMPLETE: string = "insertcomplete";
    //게시글 삭제
    public static readonly DELETEBOARDONE: string = "deleteboardone";
    public static readonly DELETECOMPLETE: string = "deletecomplete";
    //게시글 보기
    public static readonly BOARDDETAIL: string = "boarddetail";
    public static readonly BOARDDETAILCOMPLETE: string = "boarddetailcomplete";
    //게시글 수정
    public static readonly BOARDEDIT: string = "boardedit";
    public static readonly BOARDEDITCOMPLETE: string = "boardeditcomplete";
}