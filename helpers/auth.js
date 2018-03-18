const Idea = require("../models/Idea");
module.exports = {
  checkAuthentication: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  },
  checkOwnership: (req, res, next) => {
    Idea.findById(req.params.id)
      .then(idea => {
      if(req.isAuthenticated() && req.user.id === idea.user.toString()){
        next();
      }else{
        req.flash('error_msg', "Not Authorized");
        res.redirect("back");
      }
    })
  }
}
