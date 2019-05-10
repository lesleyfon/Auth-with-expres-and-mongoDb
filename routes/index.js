var express = require('express');
var router = express.Router();
var User = require('./../models/user')

router.get("/login", function(req, res, next){
  
  return res.render("Login", {title: "Login"});
})
router.post("/login", function(req, res, next){
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(err, user){
      if(err|| user){
        var error = new Error("Wrong email or password");
        error.status = 401;
        return next(error);
      }else{
        // creating session 
        req.session.userId = user._id;
        return res.redirect("/profile")
      }
    })
  } else {
    var err = new Error("Email and password are required");
    err.status = 401;
    return next(err);
  }
})

// get /register
router.get("/register", function(req, res, next){
  return res.render('register', {title: 'Sign Up'})
})

// Post /register
router.post("/register", function(req, res, next){
  if(req.body.email && req.body.name && req.body.favoriteBook && req.body.password && req.body.confirmPassword){

    // confirm that user type the same password twice
    if(req.body.password !== req.body.confirmPassword){
      var err = new Error('Password do not match');
      err.status = 400
      return next(err)
    }
    // create object with form input

    var userData = {
      email: req.body.email, 
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password,
    }
    // Use Schema create method to insert document into mongodb
    User.create(userData, function(error, user){
      if(error){
        return next(error)
      } else{
        req.session.userId = user._id;

        return res.redirect("/profile")
      }
    })
  
  }else{
    var err = new Error('All fields required');
    err.status = 400;
    return next(err);

  }
})


// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
