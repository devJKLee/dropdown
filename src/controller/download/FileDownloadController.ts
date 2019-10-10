/**
 * Created by JK
 * date: 2018-12-10
 */

import {MysqlError} from "mysql";
import {FileVO} from "../../VO/FileVO";
import {Service} from "../../service/Service";
import {Query} from "../../service/Query";
import * as express from 'express';
import {BinaryData, existsSync, readFileSync} from "fs";
import {Path} from "../../config/Path";
import * as nodezip from 'node-zip';

export class FileDownloadController {

    // 단위 (Mb)
    private static readonly zipMaxSize:number = 100;

    /**
     * 다운로드 페이지 요청이 들어온 경우, GUID 값으로 DB 에서 해당 파일의 데이터를 가져온다.
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static getFileList(req:express.Request, res:express.Response): void
    {
        let guid: string = req.query.guid;
        Service.queryExecution(Query.GETFILELIST, guid, (err: MysqlError, results: any) => { if(err) throw err; this.getFileListComplete(res, results, guid); });
    }

    /**
     * DB 에서 데이터 조회가 끝나면, 사용자에게 파일 다운로드 페이지를 보여준다.
     * @param {e.Response} res
     * @param results           DB 에서 가져온, 해당 URL 의 파일 리스트
     */
    private static getFileListComplete(res:express.Response, results:any, guid:string): void
    {
        let fileList: Array<FileVO> = results as Array<FileVO>;
        this.checkThumbnail(fileList);
        let zipButtonVisible:string = "";
        if(this.getTotalFileSize(fileList) > this.zipMaxSize) zipButtonVisible = "hidden";
        res.render('download', {fileList: fileList, guid: guid, buttonVisible:zipButtonVisible});
    }

    /**
     * 실제 파일 다운로드 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    public static fileDownload(req:express.Request, res:express.Response): void
    {
        let id: number = req.params.id;
        Service.queryExecution(Query.GETFILEONE, id, (err: MysqlError, results: any) => { this.fileDownloadComplete(res, results); });
    }

    /**
     * 사용자에게 해당 파일 다운로드
     * @param {e.Response} res
     * @param results           DB 에서 전달받은 해당 파일의 데이터
     */
    private static fileDownloadComplete(res:express.Response, results: any): void
    {
        let downloadFIle: FileVO = results[0] as FileVO;
        res.download(downloadFIle.path, downloadFIle.originalname);
    }

    /**
     * 썸네일 존재 유무 확인
     * @param {Array<FileVO>} fileList  사용자가 요청한 다운로드 파일 리스트
     */
    private static checkThumbnail(fileList:Array<FileVO>):void
    {
        for(let num = 0; num < fileList.length; num++)
        {
            //썸네일 존재유무 확인
            if(existsSync(Path.THUMBNAILPATH + "/" + fileList[num].filename + ".png")) fileList[num].thumbnailPath = "./thumbnail/" + fileList[num].filename + ".png";
            else fileList[num].thumbnailPath = Path.DEFAULTTHUMBNAIL;
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
        Service.queryExecution(Query.GETFILELIST, guid, (err:MysqlError, results:any)=>{ this.getZipFileComplete(res, results); });
    }

    /**
     * DB 에서 해당 guid 값에 해당하는 데이터를 모두 가져와서, zip 파일로 돌려준다.
     * @param {e.Response} res
     * @param results
     */
    private static getZipFileComplete(res:express.Response, results:any):void
    {
        let fileList: Array<FileVO> = results as Array<FileVO>;
        let data:BinaryData = this.makeZipFile(fileList);
        res.contentType('application/zip');
        res.end(data, 'binary');
    }

    /**
     * zip 압축 파일 생성
     * @param {Array<FileVO>} fileList  파일 리스트
     */
    private static makeZipFile(fileList:Array<FileVO>):BinaryData
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
    private static getTotalFileSize(files:Array<FileVO>):number
    {
        let sum:number = 0;
        for(let idx = 0; idx < files.length; idx++)
        {
            sum += files[idx].size;
        }
        return Math.floor((sum/1024)/1024);
    }

}

