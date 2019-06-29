const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Permiso denegado.");
  res.redirect("/users/signin");
};

helpers.perfil = (req, res, next) => {
  if (req.user) {
    console.log("hay usuario");
  }
};

module.exports = helpers;
