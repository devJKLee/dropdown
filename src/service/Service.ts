/**
 * Created by JK
 * date: 2018-11-08
 */

import * as mysql from "mysql";
import * as dbConfig from "../config/database";
import {queryCallback} from "mysql";

export class Service
{
    private static connection: mysql.Connection;

    /**
     * Db 커넥션 초기화
     */
    public static init():void
    {
        Service.connection = mysql.createConnection(dbConfig);
    }

    /**
     * 요청받은 쿼리문을 수행한다.
     * @param {string} sql  요청받은 쿼리문
     * @param sqlData       쿼리문에 사용될 데이터
     * @param {queryCallback} resultCallback    결과물 쿼리 콜백
     */
    public static queryExecution(sql:string, sqlData:any, resultCallback:queryCallback):void
    {
        Service.connection.query(sql, sqlData, resultCallback);
    }
}