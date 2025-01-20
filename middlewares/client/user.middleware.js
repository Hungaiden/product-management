const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  if(req.cookies.tokenUser) {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      deleted: false,
      status: "active"
    });
    
    if(user) {
      res.locals.user = user;
    }
  }
  next();
}

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser) {
    req.flash("error", "Vui lòng đăng nhập!");
    res.redirect("/user/login");
    return;
  }

  const user = await User.findOne({
    token: req.cookies.tokenUser,
    deleted: false,
    status: "active"
  });

  if(!user) {
    req.flash("error", "Vui lòng đăng nhập!");
    res.redirect("/user/login");
    return;
  }

  next();
}