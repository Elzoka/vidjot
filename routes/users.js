const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const passport = require("passport");

// User login Route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// User Register Route
router.get('/register', (req, res) => {
  res.render("users/register");
});

// Register Form post
router.post('/register', (req, res, next) => {
  let errors = [];
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password2;

  if(password != password2){
      errors.push({text: "Passwords do not match"});
  }
  if(password.length < 4){
    errors.push({text: "Password must be at least 4 characters"});
  }
  if(errors.length > 0) {
    res.render("users/register", {
      errors,
      name,
      email,
      password,
      password2
    });
  }else{
    User.findOne({email})
      .then(user => {
        if(user){
          req.flash("error_msg", 'Email already registered');
          res.render('users/register', {name, email, password, password2});
        }else{
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if(err) throw err;
              password = hash;
              new User({name, email, password}).save()
                .then(user => {
                  req.flash('success_msg', 'Welcome Aboard');
                  passport.authenticate('local', {
                    successRedirect: "/ideas",
                    failureRedirect: "/users/login",
                    failureFlash: true
                  })(req, res, next);
                })
                .catch(err => {
                  return console.log(err);
                })
            });
          });
        }
      });
    }
});

// Login Form post
router.post("/login", (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
