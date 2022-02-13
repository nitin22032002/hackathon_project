const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
app.use(require("cors")())

// user define action's
const auth=require("./actions/authentication")
const driver=require("./actions/driver")
const delear=require("./actions/delear")
const table=require("./actions/createTables")
/**************************** */


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// map user define action
app.use("/auth/",auth)
app.use("/delear/",delear)
app.use("/driver/",driver)
app.use("/tables/",table)
/*********************** */

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
