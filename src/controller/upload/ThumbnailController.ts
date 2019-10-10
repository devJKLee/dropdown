/**
 * Created by JK
 * date: 2018-12-10
 */

import * as Thumbnail from "thumbnail";

export class ThumbnailController
{
    public static thumbnail: any;

    /**
     * thumbnail 의 초기화
     */
    public static init(filePath: string, thumbnailPath): void
    {
        ThumbnailController.thumbnail = new Thumbnail(filePath, thumbnailPath);
    }

    /**
     * 썸네일 생성
     * @param {string} filename
     * @param {number} width
     * @param {number} height
     */
    public static makeThumbnail(filename: string, width: number, height: number): void
    {
        ThumbnailController.thumbnail.ensureThumbnail(filename, width, height, function (err, filename)
        {
            /*console.log(err);
            console.log(filename);*/
        });
    }
}