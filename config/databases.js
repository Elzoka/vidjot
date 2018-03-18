const env = process.env.NODE_ENV || "developement";

if(env === 'developement'){
  process.env.MONGO_URI = 'mongodb://localhost/vidjot-dev'
}
