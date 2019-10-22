/**
 * Created by JK
 * date: 2018-10-05
 */

import {Logger, createLogger, format, LoggerOptions} from "winston";
import * as WinstonDaily from 'winston-daily-rotate-file';

export class WinstonLogger
{
    static logger:Logger;
    static options:LoggerOptions;
    // Logger 파일 생성 경로
    static readonly logDirPath:string = "log";

    /**
     * logger 초기화 및 생성
     */
    static init():void
    {
        if (typeof WinstonLogger.logger == "undefined")
        {
            this.loggerFormatInit();
            this.makeLogger();
        }
        else throw new Error("WinstonLogger already created.");
    }

    /**
     * Logger 생성
     */
    static makeLogger():void
    {
        WinstonLogger.logger = createLogger(this.options);
    }

    /**
     * Logger 옵션 초기화
     */
    static loggerFormatInit():void
    {
        this.options = <LoggerOptions>{};
        this.options.format = format.combine(format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}), format.json());
        this.options.transports = new WinstonDaily({filename : `${this.logDirPath}/%DATE%-app.log`, datePattern: 'YYYY-MM-DD'});
    }

    /**
     * Winston Info
     * @param {string} message
     */
    static info(message:string)
    {
        WinstonLogger.logger.info(message);
    }

    /**
     * Winston Error
     * @param {string} message
     */
    static error(message:string)
    {
        WinstonLogger.logger.error(message);
    }

}