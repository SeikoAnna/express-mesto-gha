const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '648df05ec800d01b2a8a6f48',
  };

  next();
});

app.use(express.json());

app.use(helmet());

app.use(router);

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});


