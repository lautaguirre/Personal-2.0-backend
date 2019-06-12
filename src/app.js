const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Connect to DB
require('./db/mongoose');

// Routes imports
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

const app = express();

const port = process.env.PORT || 3001;

// Express config
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.PORT === '3002') {
  app.use(function(req,res,next){setTimeout(next,2000)});
}

// Routes
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// Create server
app.listen(port, () => {
  console.log(`Server Running on Port: ${port}`);
});