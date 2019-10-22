"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by JK
 * date: 2018-11-20
 */
const multer = require("multer");
const path = require("path");
class MulterController {
    /**
     * multer 초기 설정
     */
    static init(filePath) {
        this.multer = multer({
            storage: multer.diskStorage(this.multerConfigSetup(filePath)),
            limits: { fileSize: 2 * 1024 * 1024 * 1024 } // MB * KB * B, ex) 1024 * 1024 * 1024 = 1GB, 현재는 2GB 까지
        });
    }
    /**
     * multer 의 DiskStorageOptions 을 셋팅한다.
     * @param {string} filePath
     * @returns {multer.DiskStorageOptions}
     */
    static multerConfigSetup(filePath) {
        let multerConfig = {
            destination: (req, file, callback) => { callback(null, filePath); },
            filename: (req, file, callback) => { callback(null, new Date().valueOf() + path.extname(file.originalname)); }
        };
        return multerConfig;
    }
}
exports.MulterController = MulterController;
//# sourceMappingURL=MulterController.js.map