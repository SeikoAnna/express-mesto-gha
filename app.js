const express = require('express');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const helmet = require('helmet');

const { errors } = require('celebrate');
const router = require('./routes');

const errorHandler = require('./middlewares/error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL);

app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
