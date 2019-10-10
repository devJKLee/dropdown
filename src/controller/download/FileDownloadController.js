"use strict";
/**
 * Created by JK
 * date: 2018-12-10
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../service/Service");
const Query_1 = require("../../service/Query");
const fs_1 = require("fs");
const Path_1 = require("../../config/Path");
const nodezip = require("node-zip");
class FileDownloadController {
    /**
     * 다운로드 페이지 요청이 들어온 경우, GUID 값으로 DB 에서 해당 파일의 데이터를 가져온다.
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static getFileList(req, res) {
        let guid = req.query.guid;
        Service_1.Service.queryExecution(Query_1.Query.GETFILELIST, guid, (err, results) => { if (err)
            throw err; this.getFileListComplete(res, results, guid); });
    }
    /**
     * DB 에서 데이터 조회가 끝나면, 사용자에게 파일 다운로드 페이지를 보여준다.
     * @param {e.Response} res
     * @param results           DB 에서 가져온, 해당 URL 의 파일 리스트
     */
    static getFileListComplete(res, results, guid) {
        let fileList = results;
        this.checkThumbnail(fileList);
        let zipButtonVisible = "";
        if (this.getTotalFileSize(fileList) > this.zipMaxSize)
            zipButtonVisible = "hidden";
        res.render('download', { fileList: fileList, guid: guid, buttonVisible: zipButtonVisible });
    }
    /**
     * 실제 파일 다운로드 요청
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static fileDownload(req, res) {
        let id = req.params.id;
        Service_1.Service.queryExecution(Query_1.Query.GETFILEONE, id, (err, results) => { this.fileDownloadComplete(res, results); });
    }
    /**
     * 사용자에게 해당 파일 다운로드
     * @param {e.Response} res
     * @param results           DB 에서 전달받은 해당 파일의 데이터
     */
    static fileDownloadComplete(res, results) {
        let downloadFIle = results[0];
        res.download(downloadFIle.path, downloadFIle.originalname);
    }
    /**
     * 썸네일 존재 유무 확인
     * @param {Array<FileVO>} fileList  사용자가 요청한 다운로드 파일 리스트
     */
    static checkThumbnail(fileList) {
        for (let num = 0; num < fileList.length; num++) {
            //썸네일 존재유무 확인
            if (fs_1.existsSync(Path_1.Path.THUMBNAILPATH + "/" + fileList[num].filename + ".png"))
                fileList[num].thumbnailPath = "./thumbnail/" + fileList[num].filename + ".png";
            else
                fileList[num].thumbnailPath = Path_1.Path.DEFAULTTHUMBNAIL;
        }
    }
    /**
     * 사용자가 파일 리스트를 zip 압축 파일로 요청한 경우
     * @param {e.Request} req
     * @param {e.Response} res
     */
    static getZipFile(req, res) {
        let guid = req.query.guid;
        Service_1.Service.queryExecution(Query_1.Query.GETFILELIST, guid, (err, results) => { this.getZipFileComplete(res, results); });
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