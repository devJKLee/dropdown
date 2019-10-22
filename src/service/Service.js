"use strict";
/**
 * Created by JK
 * date: 2018-11-08
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const FileDB_1 = require("../models/FileDB");
const dbConfig = require("../config/database");
class Service {
    /**
     * 초기화
     */
    static init() {
        this.sequelize = new sequelize_typescript_1.Sequelize(dbConfig);
        /**
         * force:true 옵션은, 서버 시작시 등록된 모델링 전체를 삭제하고, 다시 만드는 옵션이다.
         * 굉장히 위험한 옵션이므로 개발시, 꼭 필요한 경우에만 사용해야 한다.
         */
        // this.sequelize.sync({force:true});
        this.sequelize.sync();
        this.addModels();
    }
    /**
     * 설정된 모델을 DB 에 초기화시킨다.
     */
    static addModels() {
        this.sequelize.addModels([FileDB_1.FileDB]);
    }
}
exports.Service = Service;
//# sourceMappingURL=Service.js.map