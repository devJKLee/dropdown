/**
 * Created by JK
 * date: 2018-11-20
 */
import * as multer from "multer";
import * as path from "path";

export class MulterController
{
    public static multer: multer.Instance;

    /**
     * multer 초기 설정
     */
    public static init(filePath: string): void {
        this.multer = multer({
            storage: multer.diskStorage(this.multerConfigSetup(filePath)),
            limits: {fileSize: 2 * 1024 * 1024 * 1024} // MB * KB * B, ex) 1024 * 1024 * 1024 = 1GB, 현재는 2GB 까지
        });
    }

    /**
     * multer 의 DiskStorageOptions 을 셋팅한다.
     * @param {string} filePath
     * @returns {multer.DiskStorageOptions}
     */
    private static multerConfigSetup(filePath: string): multer.DiskStorageOptions {
        let multerConfig: multer.DiskStorageOptions = {
            destination: (req: Express.Request, file: Express.Multer.File, callback: Function) => { callback(null, filePath); },
            filename: (req:Express.Request, file:Express.Multer.File, callback:Function) => { callback(null, new Date().valueOf() + path.extname(file.originalname)); }
        };
        return multerConfig;
    }

}