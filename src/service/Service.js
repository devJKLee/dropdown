"use strict";
/**
 * Created by JK
 * date: 2018-11-08
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const dbConfig = require("../config/database");
class Service {
    /**
     * Db 커넥션 초기화
     */
    static init() {
        Service.connection = mysql.createConnection(dbConfig);
    }
    /**
     * 요청받은 쿼리문을 수행한다.
     * @param {string} sql  요청받은 쿼리문
     * @param sqlData       쿼리문에 사용될 데이터
     * @param {queryCallback} resultCallback    결과물 쿼리 콜백
     */
    static queryExecution(sql, sqlData, resultCallback) {
        Service.connection.query(sql, sqlData, resultCallback);
    }
}
exports.Service = Service;
//# sourceMappingURL=Service.js.map