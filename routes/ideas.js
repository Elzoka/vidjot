const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Idea = require("../models/Idea.js");
const {checkAuthentication, checkOwnership} = require('../helpers/auth');

// Add ideas form
router.get("/add", checkAuthentication,(req, res) => {
  res.render("ideas/add");
});

// process form
router.post("/", checkAuthentication,(req, res) => {
  let errors = [];
  const title = req.body.title;
  const details = req.body.details;

  if(!title){
    errors.push({text: 'Please add a title'});
  }
  if(!details){
    errors.push({text: 'Please add some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors,
      title,
      details
    });
  }else{
    const newIdea = {
      title,
      details,
      user: req.user.id
    }
    new Idea(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added successfully');
        res.redirect("/ideas");
      });
  }
});

// Idea index page
router.get("/", checkAuthentication,(req, res) => {
  Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render("ideas/index", {ideas});
    })
});

// Edit idea form
router.get("/edit/:id", checkOwnership,(req, res) => {
  Idea.findById(req.params.id)
    .then(idea => {
      res.render('ideas/edit', {idea});
    })
});

// Edit form process
router.put("/edit/:id", checkOwnership,(req, res) => {
  let updatedIdea = {
    title: req.body.title,
    details: req.body.details
  }

  Idea.findByIdAndUpdate(req.params.id, updatedIdea)
    .then(idea => {
      req.flash('success_msg', 'Video idea updated successfully');
      res.redirect("/ideas");
    })
});

// Delete idea
router.delete('/delete/:id', checkOwnership,(req, res) => {
  Idea.findByIdAndRemove(req.params.id)
    .then(idea => {
      req.flash('success_msg', 'Video idea removed successfully');
      res.redirect("/ideas")
    });
});
module.exports = router;
