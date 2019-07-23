var express = require('express');

// session 存储
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
// 日志

// 数据库
var mongoose = require('./db/mongodb');
// 服务启动
var app = express();
app.all('*', (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || 'http://localhost:8080';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
var router = express.Router();
app.use(router);
// 服务器提交的数据json化
app.use(bodyParser.json());
// 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({extended: true}));
// session 存储
app.use(cookieParser());
app.use(session({
    secret: 'vuechat',
    resave: false,
    saveUninitialized: true
}));
require('./router/routes')(app);
var server = app.listen(9090);
require('./websocket.js')(server);


















