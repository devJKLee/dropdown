"use strict";
/**
 * Created by JK
 * date: 2018-11-12
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
}
//파일 관련
Query.FILEUPLOAD = 'INSERT INTO IMFORM_FILE_DB SET ?';
Query.GETFILELIST = 'SELECT * FROM IMFORM_FILE_DB WHERE IS_DELETED = 0 AND GUID = ?';
Query.GETFILEONE = 'SELECT * FROM IMFORM_FILE_DB WHERE IS_DELETED = 0 AND ID = ?';
exports.Query = Query;
//# sourceMappingURL=Query.js.map