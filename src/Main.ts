import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as errorHandler from "errorhandler";
import * as expressSession from 'express-session';
import {Route} from "./routes/Route";
import {Service} from "./service/Service";
import {MulterController} from "./controller/MulterController";
import {FileUploadController} from "./controller/upload/FileUploadController";
import {FileDownloadController} from "./controller/download/FileDownloadController";
import {ThumbnailController} from "./controller/upload/ThumbnailController";
import {Path} from "./config/Path";

export class Server
{
    public static app: express.Application;
    private route:Route;

    constructor()
    {
        Server.app = express();
        this.serverSetup();
        this.serverStart();
    }

    /**
     * 초기 설정
     */
    private serverSetup(): void
    {
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
        Server.app.use(bodyParser.urlencoded({extended: true}));
        Server.app.use(bodyParser.json());
        //쿠키 설정
        Server.app.use(cookieParser());
        //에러 핸들러
        Server.app.use(errorHandler());
        //세션 설정
        Server.app.use(expressSession({
            secret : '@#@$MYSIGN#@$#$',
            resave : false,
            saveUninitialized : true
        }));
        //multer 초기화
        MulterController.init(Path.UPLOADPATH);
        //thumbnail 초기화
        ThumbnailController.init(Path.UPLOADPATH, Path.THUMBNAILPATH);
        //파일 업로드 컨트롤러 초기화
        new FileUploadController();
        //파일 다운로드 컨트롤러 초기화
        new FileDownloadController();
        //DB 용 클래스
        Service.init();
        //라우터 초기화
        this.route = new Route();
    }

    /**
     * 서버 셋팅이 완료되면, 서버 시작
     */
    private serverStart():void
    {
        http.createServer(Server.app).listen(Server.app.get('port'), ()=>
        {
            console.log("Server Start. PORT :  " + Server.app.get('port'));
        });
    }
}

let main: Server = new Server();