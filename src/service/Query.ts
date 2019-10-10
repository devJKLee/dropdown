/**
 * Created by JK
 * date: 2018-11-12
 */

export class Query
{
    //파일 관련
    public static readonly FILEUPLOAD:string = 'INSERT INTO IMFORM_FILE_DB SET ?';
    public static readonly GETFILELIST:string = 'SELECT * FROM IMFORM_FILE_DB WHERE IS_DELETED = 0 AND GUID = ?';
    public static readonly GETFILEONE:string = 'SELECT * FROM IMFORM_FILE_DB WHERE IS_DELETED = 0 AND ID = ?';
}