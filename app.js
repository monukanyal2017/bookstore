require('./db/config');
const express = require('express');
var app = express();
const http = require('http');
const path = require('path');
const md5=require('md5');
var mongoose=require('mongoose');
const fileUpload = require('express-fileupload');
var morgan = require('morgan');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'client/dist/client')));

// API location
/*------routes Define---------------------*/
const routes = require('./routes/index.js');
const Book = require('./routes/Book.js');
const mpesa = require('./routes/payment.js');
const categories = require('./routes/categories.js');

app.use('/api/', routes);
app.use('/api/books', Book);
app.use('/api/pay', mpesa);
app.use('/api/categories', categories);
/*---------routes end---------------------*/
// Send all other requests to the Angular app
app.get('*', (req, res) => {
  //res.send('Welcome to mpesa');
  res.sendFile(path.join(__dirname, 'client/dist/client/index.html'));
});

//Set Port
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Server is listening on ' + port);
});


