/**
 * Created by JK
 * date: 2018-12-10
 */

import {MysqlError} from "mysql";
import {FileVO} from "../../VO/FileVO";
import {Service} from "../../service/Service";
import {Query} from "../../service/Query";
import {Guid} from "../../util/Guid";
import * as express from 'express';
import {ThumbnailController} from "./ThumbnailController";

export class FileUploadController
{

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
        if(fileList.length != 0) this.fileUploadProcess(fileList, guid, res);
    }

    /**
     * 해당 파일들을 DB 에 업로드한다.
     * @param {Array<Object>} fileSource    첨부 파일 데이터
     * @param {string} key                  해당 파일이 첨부된 URL의 키값
     */
    public static fileUploadProcess(fileSource:Array<Object>, guid:Guid, res:express.Response):void
    {
        for(let num = 0; num < fileSource.length; num++)
        {
            let fileVO:FileVO = fileSource[num] as FileVO;
            fileVO.guid = guid;
            console.log(fileVO);
            Service.queryExecution(Query.FILEUPLOAD, fileVO, (err:MysqlError, results:any)=>{ if(err) throw err; this.fileUploadProcessComplete(fileVO, res); });
        }
    }

    /**
     * 해당 파일의 DB 업로드가 종료되면, 해당 파일의 이미지 타입을 체크해서 썸네일을 제작한다.
     * @param {FileVO} file
     */
    private static fileUploadProcessComplete(file:FileVO, res:express.Response):void
    {
        this.imageTypeCheck(file);
        res.sendStatus(200);
    }

    /**
     * 파일의 타입을 체크해서, 이미지 형태의 파일(확장자 'png', 'jpg', 'jpeg', 'gif')이면 썸네일을 생성한다.
     * @param {FileVO} file 썸네일을 생성하려는 파일
     */
    public static imageTypeCheck(file:FileVO):void
    {
        var imageType = /image.*/;
        if (file.mimetype.match(imageType))
        {
            ThumbnailController.makeThumbnail(file.filename, 400, 300);
        }
    }

}

