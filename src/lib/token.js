const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

/**
 * JWT 토큰 생성
 * @param {any} payload
 * @returns {string} token
 */
function generateToken(payload) {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(
        payload,
        jwtSecret,
        {
          expiresIn: '7d'
        }, (error, token) => {
          if (error) reject(error);
          resolve(token);
        }
      );
    }
  );
}

function decodeToken(token) {
  return new Promise(
    (resolve, reject) => {
      jwt.verify(token, jwtSecret, (error, decoded) => {
        if (error) reject(error);
        resolve(decoded);
      });
    }
  );
}

exports.generateToken = generateToken;

exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token'); //ctx 에서 access_token 를 읽어온다.
  console.log('token: ', token);
  if (!token) return next(); //토큰이 없으면 바로 다음 작업을 진행합니다.

  try {
    const decoded = await decodeToken(token); //토큰을 디코딩한다.
    console.log('decoded: ', decoded, Date.now() / 1000 - decoded.iat);
    console.log('--------------');

    //토큰 만료일이 하루 밖에 안남았다면 토큰을 재발급.
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      //하루가 지나면 갱신함
      const { _id, profile } = decoded;
      const freshToken = await generateToken({ _id, profile }, 'account');
      ctx.cookies.set('access_token', freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, //days
        httpOnly: true
      })

      console.log('decoded2: ', decoded);
    }
    
    //ctx.request.user에 디코딩된 값을 넣어줌
    ctx.request.user = decoded;
  } catch (e) {
    //token validate 실패
    ctx.request.user = null;
  }

  return next();
};