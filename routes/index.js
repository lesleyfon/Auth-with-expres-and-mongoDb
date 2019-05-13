var express = require('express');
var router = express.Router();
var User = require('./../models/user')
var mid = require("./../midleware")

// Get //Profile
router.get('/profile', mid.reqLogin, function(req, res, next){
  // same as middlewaregit 
  // if(!req.session.userId){
  //   var err = new Error("You are not authorized to view this page!!!")
  //   // 403 forbidden
  //   err.status = 403;
  //   return next(err)
  // }
  User.findById(req.session.userId).exec(function(err, user){
      if(err){
        return next(err)
      } else{
          return res.render('Profile', {title: "Profile", name: user.name, favorite: user.favoriteBook})
      }
  })
})

// get //login
router.get("/login", mid.loggedOut, function(req, res, next){
  
  return res.render("Login", {title: "Login"});
})
//Post // Login
router.post("/login", function(req, res, next){
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(err, user){
      // if err and theres no user then create and error
      if(err || !user){
        
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
    // Unauthorized
    err.status = 401;
    return next(err);
  }
})
router.get("/logout", function(req, res, next){
  if(req.session){
    //when the logout button is clicked and it redirects us to the logout route, we delete the session but first is theres an err we show the error else we redirect to the home page
    req.session.destroy(function(err){
      if(err){
        return next(err)
      } else{
        return res.redirect('/')
      }
    })
  }
});
// get /register
router.get("/register", mid.loggedOut ,function(req, res, next){
  
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
