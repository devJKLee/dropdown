"use strict";
/**
 * Created by JK
 * date: 2018-12-10
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Thumbnail = require("thumbnail");
class ThumbnailController {
    /**
     * thumbnail 의 초기화
     */
    static init(filePath, thumbnailPath) {
        ThumbnailController.thumbnail = new Thumbnail(filePath, thumbnailPath);
    }
    /**
     * 썸네일 생성
     * @param {string} filename
     * @param {number} width
     * @param {number} height
     */
    static makeThumbnail(filename, width, height) {
        ThumbnailController.thumbnail.ensureThumbnail(filename, width, height, function (err, filename) {
            /*console.log(err);
            console.log(filename);*/
        });
    }
}
exports.ThumbnailController = ThumbnailController;
//# sourceMappingURL=ThumbnailController.js.map