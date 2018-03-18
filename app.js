const express = require("express");
const app = express();
const exphbs  = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');

//Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Setting the port
const port = process.env.PORT || 3000;

// load database
require("./config/databases");

// Connect to mongoose
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));
console.log(__dirname)
app.use(express.static(__dirname + "/public"));

// express session middleware
app.use(session({
  secret: 'This is a long and very secure name :D',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// passport config
require('./config/passport')(passport);
  //passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// INDEX Route
app.get("/", (req, res) => {
  res.render("index");
});

// ABOUT Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use Router
app.use("/ideas", ideas);
app.use("/users", users);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
