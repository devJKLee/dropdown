"use strict";
/**
 * Created by JK
 * date: 2018-11-08
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Main_1 = require("../Main");
const MulterController_1 = require("../controller/MulterController");
const FileUploadController_1 = require("../controller/upload/FileUploadController");
const FileDownloadController_1 = require("../controller/download/FileDownloadController");
class Route {
    constructor() {
        this.router = express.Router();
        this.routerInit();
    }
    /**
     * 라우팅 경로 설정
     */
    routerInit() {
        //업로드 페이지를 요청한 경우
        this.router.route('/upload').get((req, res) => { FileUploadController_1.FileUploadController.fileUploadPageRequest(req, res); });
        //파일 업로드
        this.router.route('/upload').post(MulterController_1.MulterController.multer.array('file'), (req, res) => { FileUploadController_1.FileUploadController.fileUpload(req, res); });
        //다운로드 페이지를 요청한 경우
        this.router.route('/download').get((req, res) => { FileDownloadController_1.FileDownloadController.getFileList(req, res); });
        //파일 다운로드
        this.router.route('/download/file/:id').get((req, res) => { FileDownloadController_1.FileDownloadController.fileDownload(req, res); });
        //파일 리스트를 zip 파일 압축본으로 요청한 경우
        this.router.route('/zip').get((req, res) => { FileDownloadController_1.FileDownloadController.getZipFile(req, res); });
        Main_1.Server.app.use(this.router);
        //지정된 경로 이외의 URL 호출 시, 404 에러 페이지로 리다이렉트
        Main_1.Server.app.all('*', (req, res) => { res.status(404).redirect('./404.html'); });
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map