/**
 * Created by JK
 * date: 2018-11-08
 */

import * as express from "express";
import {Server} from "../Main";
import {MulterController} from "../controller/MulterController";
import {FileUploadController} from "../controller/upload/FileUploadController";
import {FileDownloadController} from "../controller/download/FileDownloadController";

export class Route
{
    private readonly router: express.Router;

    constructor()
    {
        this.router = express.Router();
        this.routerInit();
    }

    /**
     * 라우팅 경로 설정
     */
    private routerInit():void
    {
        //업로드 페이지를 요청한 경우
        this.router.route('/upload').get( (req:express.Request, res:express.Response)=>{ FileUploadController.fileUploadPageRequest(req, res); });

        //파일 업로드
        this.router.route('/upload').post( MulterController.multer.array('file'), (req:express.Request, res:express.Response)=>{ FileUploadController.fileUpload(req, res); });

        //다운로드 페이지를 요청한 경우
        this.router.route('/download').get( (req:express.Request, res:express.Response)=>{ FileDownloadController.getFileList(req, res); });

        //파일 다운로드
        this.router.route('/download/file/:id').get( (req:express.Request, res:express.Response)=>{ FileDownloadController.fileDownload(req, res); });
        
        //파일 리스트를 zip 파일 압축본으로 요청한 경우
        this.router.route('/zip').get( (req:express.Request, res:express.Response)=>{ FileDownloadController.getZipFile(req, res); });

        Server.app.use(this.router);
        //지정된 경로 이외의 URL 호출 시, 404 에러 페이지로 리다이렉트
        Server.app.all('*', (req:express.Request, res:express.Response)=>{ res.status(404).redirect('./404.html'); });
    }

}