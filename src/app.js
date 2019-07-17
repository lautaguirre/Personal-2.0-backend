const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Connect to DB
require('./db/mongoose');

// Routes imports
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const informationRouter = require('./routes/information');

const app = express();

const port = process.env.PORT || 3001;

// Express config
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization,x-access-token');
  next();
});

// Fake latency
if (process.env.PORT === '3002') {
  app.use((req,res,next) => {
    setTimeout(next, 500);
  });
}

// Routes
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/information', informationRouter);

// Create server
app.listen(port, () => {
  console.log(`Server Running on Port: ${port}`);
});
