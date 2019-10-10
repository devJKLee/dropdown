"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by JK
 * date: 2018-11-20
 */
const multer = require("multer");
class MulterController {
    /**
     * multer 초기 설정
     */
    static init(path) {
        this.multer = multer({
            storage: multer.diskStorage(this.multerConfigSetup(path)),
            // limits : {fileSize: 2 * 1024 * 1024 * 1024} // MB * KB * B, ex) 1024 * 1024 * 1024 = 1GB
            limits: { fileSize: 2 * 1024 * 1024 * 512 } // MB * KB * B, ex) 1024 * 1024 * 1024 = 1GB
        });
    }
    /**
     * multer 의 DiskStorageOptions 을 셋팅한다.
     * @returns {multer.DiskStorageOptions}
     */
    static multerConfigSetup(path) {
        let multerConfig = {
            destination: (req, file, callback) => { callback(null, path); }
        };
        return multerConfig;
    }
}
exports.MulterController = MulterController;
//# sourceMappingURL=MulterController.js.map