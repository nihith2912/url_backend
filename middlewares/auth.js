const { getUser } = require('../services/auth');

function checkForAuthentication(req, res, next){
    const tokenCookie = req.cookies.token;

    if(!tokenCookie)  return next(); 

    const token = tokenCookie;
    const user = getUser(token);
    if(user){
    req.user = user;
    }
    return next();
}

function restrictTo(roles){
    return (req, res, next) => {
        if(!req.user) return res.redirect("/login");
        if(!roles.includes(req.user.role)){
            return res.end("You are not authorized to access this resource");
        }
        return next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};