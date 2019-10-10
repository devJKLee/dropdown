/**
 * Created by JK
 * date: 2018-11-20
 */
import * as multer from "multer";

export class MulterController
{
    public static multer: multer.Instance;

    /**
     * multer 초기 설정
     */
    public static init(path:string):void
    {
        this.multer = multer({
            storage : multer.diskStorage(this.multerConfigSetup(path)),
            // limits : {fileSize: 2 * 1024 * 1024 * 1024} // MB * KB * B, ex) 1024 * 1024 * 1024 = 1GB
            limits : {fileSize: 2 * 1024 * 1024 * 512} // MB * KB * B, ex) 1024 * 1024 * 1024 = 1GB
        });
    }
    
    /**
     * multer 의 DiskStorageOptions 을 셋팅한다.
     * @returns {multer.DiskStorageOptions}
     */
    private static multerConfigSetup(path:string):multer.DiskStorageOptions
    {
        let multerConfig:multer.DiskStorageOptions = {
            destination: (req:Express.Request, file:Express.Multer.File, callback:Function) => { callback(null, path); }
        };
        return multerConfig;
    }

}