var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  //process.env.PORT = 8080;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/bookstore';
} else if (env === 'production') {
  //process.env.PORT = 8080;
  process.env.MONGODB_URI = 'mongodb://monu:monu@ds261138.mlab.com:61138/apidb';
}
