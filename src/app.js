const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Connect to DB
require('./db/mongoose');

// Routes imports
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const port = process.env.PORT || 3001;

// Express config
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Create server
app.listen(port, () => {
  console.log(`Server Running on Port: ${port}`);
});
