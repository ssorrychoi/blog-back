const express = require('express');
const mongoose = require('mongoose'); // MongoDB에 접근하기 위한 것
const Helmet = require('helmet'); // 보안 공격 막기 위한 것
const app = express();
/* Router */
const post = require('./routers/post');
const user = require('./routers/user');
const tag = require('./routers/tag');
const comment = require('./routers/comment');
// 토큰 인증에 관한 것
const auth = require('./common/auth')();
// CORS 허용해주는것
const cors = require('cors');

// DB 주소
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/blog-dev';
app.use(Helmet());
app.use(cors());

// Middleware
app.use((req, res, next) => {
  //next를 반드시 써줘야 함.
  mongoose
    .connect(dbURI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => next())
    .catch((e) => next(e));
});

app.use(auth.initialize());
app.use(express.json());
app.use('/auth', user);
app.use('/api/post', post);
app.use('/api/tag', tag);
app.use('/api/comment', comment);

// 이것까지 실행해야 하기 때문에 위에서 next를 써줘야한다. 그래야 여기까지 실행함.
app.use(() => mongoose.disconnect());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
