"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
const expressSession = require("express-session");
const Route_1 = require("./routes/Route");
const Service_1 = require("./service/Service");
const MulterController_1 = require("./controller/MulterController");
const FileUploadController_1 = require("./controller/upload/FileUploadController");
const FileDownloadController_1 = require("./controller/download/FileDownloadController");
const ThumbnailController_1 = require("./controller/upload/ThumbnailController");
const Path_1 = require("./config/Path");
class Server {
    constructor() {
        Server.app = express();
        this.serverSetup();
        this.serverStart();
    }
    /**
     * 초기 설정
     */
    serverSetup() {
        //포트 설정
        Server.app.set('port', process.env.PORT || 3000);
        //static 미들 웨어
        Server.app.use(express.static(path.join(__dirname, './views')));
        Server.app.use(express.static(path.join(__dirname, './uploads')));
        //뷰 엔진 설정
        Server.app.set('view engine', 'ejs');
        //뷰 페이지 경로 설정
        Server.app.set('views', path.join(__dirname, './views'));
        //morgan 로그
        Server.app.use(logger('short'));
        //Request 에 자동으로 body 속성 추가 및 인코딩, extended 는 중첩된 객체 표현 허용 여부
        Server.app.use(bodyParser.urlencoded({ extended: true }));
        Server.app.use(bodyParser.json());
        //쿠키 설정
        Server.app.use(cookieParser());
        //에러 핸들러
        Server.app.use(errorHandler());
        //세션 설정
        Server.app.use(expressSession({
            secret: '@#@$MYSIGN#@$#$',
            resave: false,
            saveUninitialized: true
        }));
        //multer 초기화
        MulterController_1.MulterController.init(Path_1.Path.UPLOADPATH);
        //thumbnail 초기화
        ThumbnailController_1.ThumbnailController.init(Path_1.Path.UPLOADPATH, Path_1.Path.THUMBNAILPATH);
        //파일 업로드 컨트롤러 초기화
        new FileUploadController_1.FileUploadController();
        //파일 다운로드 컨트롤러 초기화
        new FileDownloadController_1.FileDownloadController();
        //DB 용 클래스
        Service_1.Service.init();
        //라우터 초기화
        this.route = new Route_1.Route();
    }
    /**
     * 서버 셋팅이 완료되면, 서버 시작
     */
    serverStart() {
        http.createServer(Server.app).listen(Server.app.get('port'), () => {
            console.log("Server Start. PORT :  " + Server.app.get('port'));
        });
    }
}
exports.Server = Server;
let main = new Server();
//# sourceMappingURL=Main.js.map