/**
 * Created by JK
 * date: 2018-12-10
 */

import * as express from 'express';
import {BinaryData, existsSync, readFileSync} from "fs";
import {Path} from "../../config/Path";
import * as nodezip from 'node-zip';
import {WinstonLogger} from "../../log/WinstonLogger";
import {FileDB} from "../../models/FileDB";

export class FileDownloadController
{

    // 단위 (Mb)
    private static readonly zipMaxSize:number = 100;

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
     * 다운로드 페이지 요청이 들어온 경우, GUID 값으로 DB 에서 해당 파일의 데이터를 가져온다.
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static getFileList(req:express.Request, res:express.Response): void
    {
        let guid:string = req.query.guid;
        let queryResults = FileDB.findAll({where:{is_deleted:false, guid:guid}});
        queryResults.then((results:any)=>{ this.getFileListComplete(res, results, guid); });
        queryResults.catch((error:any)=>{ this.sendResponseError(req, res, error); });
    }

    /**
     * DB 에서 데이터 조회가 끝나면, 사용자에게 파일 다운로드 페이지를 보여준다.
     * @param {e.Response} res
     * @param results           DB 에서 가져온, 해당 URL 의 파일 리스트
     */
    private static getFileListComplete(res:express.Response, results:any, guid:string): void
    {
        let fileList: Array<FileDB> = this.downloadFileDataProcessing(results);
        this.checkThumbnail(fileList);
        let zipButtonVisible:string = "";
        if(this.getTotalFileSize(fileList) > this.zipMaxSize) zipButtonVisible = "hidden";
        res.render('download', {fileList: fileList, guid: guid, buttonVisible:zipButtonVisible});
    }

    /**
     * 다운로드 페이지에 사용될 파일을 Array<FileDB> 형태로 가공한다.
     * @param results
     * @returns {Array<FileDB>}
     */
    private static downloadFileDataProcessing(results:any):Array<FileDB>
    {
        let downloadData: Array<FileDB> = [];
        for(var num = 0; num < results.length; num++)
        {
            var data:FileDB = results[num].dataValues as FileDB;
            downloadData.push(data);
        }
        return downloadData;
    }

    /**
     * 실제 파일 다운로드 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static fileDownload(req:express.Request, res:express.Response): void
    {
        let id: number = req.params.id;
        let queryResults = FileDB.findOne({where:{is_deleted:false, id:id}});
        queryResults.then((results:any)=>{ this.fileDownloadComplete(res, results.dataValues); });
        queryResults.catch((error:any)=>{ this.sendResponseError(req, res, error); });
    }

    /**
     * 사용자에게 해당 파일 다운로드
     * @param {e.Response} res
     * @param results           DB 에서 전달받은 해당 파일의 데이터
     */
    private static fileDownloadComplete(res:express.Response, results: any): void
    {
        let downloadFile: FileDB = results as FileDB;
        res.download(downloadFile.path, downloadFile.originalname);
    }

    /**
     * 썸네일 존재 유무 확인
     * @param {Array<FileVO>} fileList  사용자가 요청한 다운로드 파일 리스트
     */
    private static checkThumbnail(fileList:Array<FileDB>):void
    {
        for(let num = 0; num < fileList.length; num++)
        {
            //썸네일 존재유무 확인
            if(existsSync(Path.THUMBNAILPATH + "/" + fileList[num].filename)) fileList[num].thumbnailpath = "./thumbnail/" + fileList[num].filename;
            else fileList[num].thumbnailpath = Path.DEFAULTTHUMBNAIL;
        }
    }

    /**
     * 사용자가 파일 리스트를 zip 압축 파일로 요청한 경우
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static getZipFile(req:express.Request, res:express.Response):void
    {
        let guid:string = req.query.guid;
        let queryResults = FileDB.findAll({where:{is_deleted:false, guid:guid}});
        queryResults.then((results:any)=>{ this.getZipFileComplete(res, results); });
        queryResults.catch((error:any)=>{ this.sendResponseError(req, res, error); });
    }

    /**
     * DB 에서 해당 guid 값에 해당하는 데이터를 모두 가져와서, zip 파일로 돌려준다.
     * @param {e.Response} res
     * @param results
     */
    private static getZipFileComplete(res:express.Response, results:any):void
    {
        let fileList: Array<FileDB> = results as Array<FileDB>;
        let data:BinaryData = this.makeZipFile(fileList);
        res.contentType('application/zip');
        res.end(data, 'binary');
    }

    /**
     * zip 압축 파일 생성
     * @param {Array<FileVO>} fileList  파일 리스트
     */
    private static makeZipFile(fileList:Array<FileDB>):BinaryData
    {
        let zip = new nodezip();
        for(let idx = 0; idx < fileList.length; idx++)
        {
            zip.file(fileList[idx].originalname, readFileSync(fileList[idx].path));
        }
        return zip.generate({base64:false, compression:'DEFLATE'});
    }

    /**
     * 해당 파일 리스트의 총 크기를 구한다.
     * @param {Array<FileVO>}   files 파일 리스트
     * @returns {number}        총 크기 (단위 Bytes)
     */
    private static getTotalFileSize(files:Array<FileDB>):number
    {
        let sum:number = 0;
        for(let idx = 0; idx < files.length; idx++)
        {
            sum += files[idx].size;
        }
        return Math.floor((sum/1024)/1024);
    }

}

