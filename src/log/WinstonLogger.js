"use strict";
/**
 * Created by JK
 * date: 2018-10-05
 */
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const WinstonDaily = require("winston-daily-rotate-file");
class WinstonLogger {
    /**
     * logger 초기화 및 생성
     */
    static init() {
        if (typeof WinstonLogger.logger == "undefined") {
            this.loggerFormatInit();
            this.makeLogger();
        }
        else
            throw new Error("WinstonLogger already created.");
    }
    /**
     * Logger 생성
     */
    static makeLogger() {
        WinstonLogger.logger = winston_1.createLogger(this.options);
    }
    /**
     * Logger 옵션 초기화
     */
    static loggerFormatInit() {
        this.options = {};
        this.options.format = winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.json());
        this.options.transports = new WinstonDaily({ filename: `${this.logDirPath}/%DATE%-app.log`, datePattern: 'YYYY-MM-DD' });
    }
    /**
     * Winston Info
     * @param {string} message
     */
    static info(message) {
        WinstonLogger.logger.info(message);
    }
    /**
     * Winston Error
     * @param {string} message
     */
    static error(message) {
        WinstonLogger.logger.error(message);
    }
}
// Logger 파일 생성 경로
WinstonLogger.logDirPath = "log";
exports.WinstonLogger = WinstonLogger;
//# sourceMappingURL=WinstonLogger.js.map