/**
 * Created by JK
 * date: 2018-11-08
 */

import {Sequelize} from "sequelize-typescript";
import {FileDB} from "../models/FileDB";
import * as dbConfig from '../config/database';


export class Service
{
    static sequelize:Sequelize;

    /**
     * 초기화
     */
    static init():void
    {
        this.sequelize = new Sequelize(dbConfig);
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
    static addModels():void
    {
        this.sequelize.addModels([FileDB]);
    }
}