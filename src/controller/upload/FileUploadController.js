"use strict";
/**
 * Created by JK
 * date: 2018-12-10
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Guid_1 = require("../../util/Guid");
const ThumbnailController_1 = require("./ThumbnailController");
const FileDB_1 = require("../../models/FileDB");
const WinstonLogger_1 = require("../../log/WinstonLogger");
class FileUploadController {
    /**
     * DB 커넥션 과정에서 에러가 발생했을 시, 로그를 남기고 에러 처리한다.
     * 만약, ajax 를 통한 통신 요청이었다면, 500 error 를 반환하고,
     * 관리자 페이지 내에서 발생한 에러라면 404 error 처리한다.
     * @param error
     * @param {e.Response} res
     */
    static sendResponseError(req, res, error) {
        WinstonLogger_1.WinstonLogger.error(error);
        if (req.xhr)
            res.status(500).send({ status: 500, message: 'internal error', type: 'internal' });
        else
            res.render('404');
    }
    /**
     * 업로드 페이지 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static fileUploadPageRequest(req, res) {
        let userAgent = req.headers['user-agent'];
        if (/Trident|MSIE/.test(userAgent) || /Edge/.test(userAgent)) {
            res.status(200).redirect('notIE.html');
            return;
        }
        let guid = Guid_1.Guid.create();
        res.render('upload', { guid: guid });
    }
    /**
     * 실제 파일 업로드 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static fileUpload(req, res) {
        let fileList = req.files;
        let guid = req.body.guid;
        if (fileList.length != 0)
            this.fileUploadProcess(fileList, guid, req, res);
    }
    /**
     * 해당 파일들을 DB 에 업로드한다.
     * @param {Array<Object>} fileSource    첨부 파일 데이터
     * @param {string} key                  해당 파일이 첨부된 URL의 키값
     */
    static fileUploadProcess(fileSource, guid, req, res) {
        for (let num = 0; num < fileSource.length; num++) {
            let fileVO = fileSource[num];
            fileVO.guid = guid;
            let queryResults = FileDB_1.FileDB.create(fileVO);
            queryResults.then(() => { this.fileUploadProcessComplete(fileVO, res); });
            queryResults.catch((error) => { this.sendResponseError(req, res, error); });
        }
    }
    /**
     * 해당 파일의 DB 업로드가 종료되면, 해당 파일의 이미지 타입을 체크해서 썸네일을 제작한다.
     * @param {FileDB} file
     */
    static fileUploadProcessComplete(file, res) {
        this.imageTypeCheck(file);
        res.sendStatus(200);
    }
    /**
     * 파일의 타입을 체크해서, 이미지 형태의 파일(확장자 'png', 'jpg', 'jpeg', 'gif')이면 썸네일을 생성한다.
     * @param {FileDB} file 썸네일을 생성하려는 파일
     */
    static imageTypeCheck(file) {
        var imageType = /image.*/;
        if (file.mimetype.match(imageType))
            ThumbnailController_1.ThumbnailController.makeThumbnail(file.filename, 400, 300);
    }
}
exports.FileUploadController = FileUploadController;
//# sourceMappingURL=FileUploadController.js.map