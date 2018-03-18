const env = process.env.NODE_ENV || "developement";

if(env === 'developement'){
  process.env.MONGODB_URI = 'mongodb://localhost/vidjot-dev'
}
