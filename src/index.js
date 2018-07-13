require('dotenv').config(); // .env 파일에서 환경변수 불러오기
const { jwtMiddleware } = require('lib/token');

const Koa = require('koa');
const IO = require('koa-socket-2');
const Router = require('koa-router');

const app = new Koa();
const io = new IO();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

mongoose.Promise = global.Promise; // Node 의 네이티브 Promise 사용
// mongodb 연결
mongoose.connect(process.env.MONGO_URI).then(
  (response) => {
    console.log('Successfully connected to mongodb');
  }
).catch(e => {
  console.error(e);
});

const port = process.env.PORT || 4000; // PORT 값이 설정되어있지 않다면 4000 을 사용합니다.

app.use(bodyParser()); // 바디파서 적용, 라우터 적용코드보다 상단에 있어야합니다.
app.use(jwtMiddleware);

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정
app.use(router.routes()).use(router.allowedMethods());


io.attach(app);

io.on('message', (ctx, data) => {
  console.log('client send date to message endpoint', data);
});

app.listen(port, () => {
  console.log('heurm server is listening to port ' + port);
});



//////////////////////

const crypto = require('crypto');

const password = 'abc123';
const secret = 'MySecretKey1$1$234';

const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');

console.log(hashed);

console.log('--------------');

const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'secret-key', { expiresIn: '7d' }, (err, token) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(token);
});