"use strict";
/**
 * Created by JK
 * date: 2018-12-10
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Path_1 = require("../../config/Path");
const nodezip = require("node-zip");
const WinstonLogger_1 = require("../../log/WinstonLogger");
const FileDB_1 = require("../../models/FileDB");
class FileDownloadController {
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
     * 다운로드 페이지 요청이 들어온 경우, GUID 값으로 DB 에서 해당 파일의 데이터를 가져온다.
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static getFileList(req, res) {
        let guid = req.query.guid;
        let queryResults = FileDB_1.FileDB.findAll({ where: { is_deleted: false, guid: guid } });
        queryResults.then((results) => { this.getFileListComplete(res, results, guid); });
        queryResults.catch((error) => { this.sendResponseError(req, res, error); });
    }
    /**
     * DB 에서 데이터 조회가 끝나면, 사용자에게 파일 다운로드 페이지를 보여준다.
     * @param {e.Response} res
     * @param results           DB 에서 가져온, 해당 URL 의 파일 리스트
     */
    static getFileListComplete(res, results, guid) {
        let fileList = this.downloadFileDataProcessing(results);
        this.checkThumbnail(fileList);
        let zipButtonVisible = "";
        if (this.getTotalFileSize(fileList) > this.zipMaxSize)
            zipButtonVisible = "hidden";
        res.render('download', { fileList: fileList, guid: guid, buttonVisible: zipButtonVisible });
    }
    /**
     * 다운로드 페이지에 사용될 파일을 Array<FileDB> 형태로 가공한다.
     * @param results
     * @returns {Array<FileDB>}
     */
    static downloadFileDataProcessing(results) {
        let downloadData = [];
        for (var num = 0; num < results.length; num++) {
            var data = results[num].dataValues;
            downloadData.push(data);
        }
        return downloadData;
    }
    /**
     * 실제 파일 다운로드 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static fileDownload(req, res) {
        let id = req.params.id;
        let queryResults = FileDB_1.FileDB.findOne({ where: { is_deleted: false, id: id } });
        queryResults.then((results) => { this.fileDownloadComplete(res, results.dataValues); });
        queryResults.catch((error) => { this.sendResponseError(req, res, error); });
    }
    /**
     * 사용자에게 해당 파일 다운로드
     * @param {e.Response} res
     * @param results           DB 에서 전달받은 해당 파일의 데이터
     */
    static fileDownloadComplete(res, results) {
        let downloadFile = results;
        res.download(downloadFile.path, downloadFile.originalname);
    }
    /**
     * 썸네일 존재 유무 확인
     * @param {Array<FileVO>} fileList  사용자가 요청한 다운로드 파일 리스트
     */
    static checkThumbnail(fileList) {
        for (let num = 0; num < fileList.length; num++) {
            //썸네일 존재유무 확인
            if (fs_1.existsSync(Path_1.Path.THUMBNAILPATH + "/" + fileList[num].filename))
                fileList[num].thumbnailpath = "./thumbnail/" + fileList[num].filename;
            else
                fileList[num].thumbnailpath = Path_1.Path.DEFAULTTHUMBNAIL;
        }
    }
    /**
     * 사용자가 파일 리스트를 zip 압축 파일로 요청한 경우
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static getZipFile(req, res) {
        let guid = req.query.guid;
        let queryResults = FileDB_1.FileDB.findAll({ where: { is_deleted: false, guid: guid } });
        queryResults.then((results) => { this.getZipFileComplete(res, results); });
        queryResults.catch((error) => { this.sendResponseError(req, res, error); });
    }
    /**
     * DB 에서 해당 guid 값에 해당하는 데이터를 모두 가져와서, zip 파일로 돌려준다.
     * @param {e.Response} res
     * @param results
     */
    static getZipFileComplete(res, results) {
        let fileList = results;
        let data = this.makeZipFile(fileList);
        res.contentType('application/zip');
        res.end(data, 'binary');
    }
    /**
     * zip 압축 파일 생성
     * @param {Array<FileVO>} fileList  파일 리스트
     */
    static makeZipFile(fileList) {
        let zip = new nodezip();
        for (let idx = 0; idx < fileList.length; idx++) {
            zip.file(fileList[idx].originalname, fs_1.readFileSync(fileList[idx].path));
        }
        return zip.generate({ base64: false, compression: 'DEFLATE' });
    }
    /**
     * 해당 파일 리스트의 총 크기를 구한다.
     * @param {Array<FileVO>}   files 파일 리스트
     * @returns {number}        총 크기 (단위 Bytes)
     */
    static getTotalFileSize(files) {
        let sum = 0;
        for (let idx = 0; idx < files.length; idx++) {
            sum += files[idx].size;
        }
        return Math.floor((sum / 1024) / 1024);
    }
}
// 단위 (Mb)
FileDownloadController.zipMaxSize = 100;
exports.FileDownloadController = FileDownloadController;
//# sourceMappingURL=FileDownloadController.js.map