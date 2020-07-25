let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
require('dotenv').config()

let routes = require('./routes');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serves all of our static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// ---------- MongoDB connection ----------

const MongoClient = require('mongodb').MongoClient

let uri = process.env.DB_URI;

MongoClient.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(client => {
    let db = client.db(process.env.DB_NAME);
    app.locals.db = db;

    // SET UP COLLECTION REFERENCES HERE
    app.locals.users = db.collection('users');
    app.locals.tasks = db.collection('tasks');

    console.log("Connected to MongoDB!");
  }).catch(error => {
  console.error(error);
});

// ----------------------------------


module.exports = app;