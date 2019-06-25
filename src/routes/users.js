const router = require("express").Router();
const passport = require("passport");

// Models
const Usuario = require("../models/User");

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const exiUsuario = await Usuario.findOne({ documento: req.body.documento });
  if (exiUsuario) {
    req.flash(
      "error_msg",
      "Ya exite el usuario con documento :" + req.body.documento
    );
    res.redirect("/users/signup");
  } else {
    // Saving a New User
    const newUser = new Usuario({
      documento: req.body.documento,
      nombre: req.body.nombre,
      correo: req.body.correo,
      telefono: req.body.telefono,
      password: req.body.password,
      tipo: "aspirante"
    });
    newUser.password = await newUser.encryptPassword(req.body.password);
    await newUser.save();
    req.flash("success_msg", "Registro de Usuario exitoso.");
    res.redirect("/users/signin");
  }
});

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

router.post(
  "/users/signin",
  passport.authenticate("local", {
    successRedirect: "/ver-cursos",
    failureRedirect: "/users/signin",
    failureFlash: true
  })
);

router.get("/users/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Estás desconectado ahora.");
  res.redirect("/users/signin");
});

module.exports = router;
