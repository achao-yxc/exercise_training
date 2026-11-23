var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const { expressjwt } = require('express-jwt')
const SECRET_KEY = 'tokenSecretKey'
// 中间件校验token，解析JWT字符串
// unless 排除无需校验的路由
app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'], // 使用何种加密算法解析
  })
  .unless({
    path: ['/users/login'] // 登录页无需校验
  })
)

app.use((req, res, next) => {
  console.log(req.auth)
  next()
})

app.use('/users', usersRouter)
const routeRouter = require('./routes/route')
app.use('/route', routeRouter)
const roleRouter = require('./routes/role')
app.use('/role', roleRouter)
const subjectRouter = require('./routes/subject')
app.use('/subject', subjectRouter)
const questionRouter = require('./routes/question')
app.use('/question', questionRouter)
const fileRouter = require('./routes/file')
app.use('/file', fileRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 监听express-jwt验证token错误，打印日志
  if (err.name === 'UnauthorizedError') {
    console.error('JWT Verification Error:', err.message)
    return res.status(401).json({ code: 401, message: '无效的token' })
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;