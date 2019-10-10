/**
 * Created by JK
 * date: 2018-11-21
 */
import {Guid} from "../util/Guid";

export interface FileVO
{
    //아이디
    id:string;
    //해당 파일이 첨부된 URL의 키값(ex: 카카오톡 공유시 생성된, GUID 키 등)
    guid:Guid;
    //INPUT 태그 NAME명
    fieldname:string;
    //원래 파일명
    originalname:string;
    //인코딩
    encoding:string;
    //파일 타입 ex) image/png 등
    mimetype:string;
    //업로드 경로
    destination:string;
    //실제 경로에 저장된 파일명
    filename:string;
    //path
    path:string;
    //썸네일 경로
    thumbnailPath:string;
    //파일 크기, 단위 Byte
    size:number;
    //업로드 날짜
    date:string;
}