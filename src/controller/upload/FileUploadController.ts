/**
 * Created by JK
 * date: 2018-12-10
 */

import {Guid} from "../../util/Guid";
import * as express from 'express';
import {ThumbnailController} from "./ThumbnailController";
import {FileDB} from "../../models/FileDB";
import {WinstonLogger} from "../../log/WinstonLogger";

export class FileUploadController
{

    /**
     * DB 커넥션 과정에서 에러가 발생했을 시, 로그를 남기고 에러 처리한다.
     * 만약, ajax 를 통한 통신 요청이었다면, 500 error 를 반환하고,
     * 관리자 페이지 내에서 발생한 에러라면 404 error 처리한다.
     * @param error
     * @param {e.Response} res
     */
    private static sendResponseError(req:express.Request, res:express.Response, error:any):void
    {
        WinstonLogger.error(error);
        if(req.xhr) res.status(500).send({status:500, message:'internal error', type:'internal'});
        else res.render('404');
    }

    /**
     * 업로드 페이지 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static fileUploadPageRequest(req:express.Request, res:express.Response):void
    {
        let userAgent:string = req.headers['user-agent'];
        if(/Trident|MSIE/.test(userAgent) || /Edge/.test(userAgent))
        {
            res.status(200).redirect('notIE.html');
            return;
        }
        let guid:Guid = Guid.create();
        res.render('upload', { guid : guid });
    }

    /**
     * 실제 파일 업로드 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static fileUpload(req:express.Request, res:express.Response):void
    {
        let fileList:Array<Object> = req.files as Array<Object>;
        let guid = req.body.guid;
        if(fileList.length != 0) this.fileUploadProcess(fileList, guid, req, res);
    }

    /**
     * 해당 파일들을 DB 에 업로드한다.
     * @param {Array<Object>} fileSource    첨부 파일 데이터
     * @param {string} key                  해당 파일이 첨부된 URL의 키값
     */
    public static fileUploadProcess(fileSource:Array<Object>, guid:string, req:express.Request, res:express.Response):void
    {
        for(let num = 0; num < fileSource.length; num++)
        {
            let fileVO:FileDB = fileSource[num] as FileDB;
            fileVO.guid = guid;
            let queryResults = FileDB.create(fileVO);
            queryResults.then(() => { this.fileUploadProcessComplete(fileVO, res); });
            queryResults.catch((error:any)=>{ this.sendResponseError(req, res, error); });
        }
    }

    /**
     * 해당 파일의 DB 업로드가 종료되면, 해당 파일의 이미지 타입을 체크해서 썸네일을 제작한다.
     * @param {FileDB} file
     */
    private static fileUploadProcessComplete(file:FileDB, res:express.Response):void
    {
        this.imageTypeCheck(file);
        res.sendStatus(200);
    }

    /**
     * 파일의 타입을 체크해서, 이미지 형태의 파일(확장자 'png', 'jpg', 'jpeg', 'gif')이면 썸네일을 생성한다.
     * @param {FileDB} file 썸네일을 생성하려는 파일
     */
    public static imageTypeCheck(file:FileDB):void
    {
        var imageType = /image.*/;
        if (file.mimetype.match(imageType)) ThumbnailController.makeThumbnail(file.filename, 400, 300);
    }

}

