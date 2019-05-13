function loggedOut(req, res, next){
    if(req.session && req.session.userId){
        return res.redirect("/profile");
    }
    return next();
}
// try to create the requires login middleware funtion use the middlware in the /profile route
// determines if the user is login by checking for a session  with the id property If they are logged in, then they just continue on to the next piece of middleware and eventually to wherever that route leads like the user profile page. However, if the user isn't logged in, it will spit out an error saying that the user must be logged in to view the page.
function reqLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else {
        var err = new Error("Must be login to view this page");
        err.status = 401;
        return next(err)
    }
}

module.exports = {
    loggedOut : loggedOut,
    reqLogin : reqLogin
};