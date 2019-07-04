const express = require('express');
const router = express.Router();
const Usuario = require("../models/User");

router.get('/',async (req, res) => {


  const coordinador = await Usuario.findOne({ documento: "123456" });
  if (!coordinador) {
    const newUser = new Usuario({
      documento: "123456",
      nombre: "Coordinador",
      correo: "admin1@tdea.com",
      telefono: "00000",
      password: "0123",
      tipo: "Coordinador"
    });
    newUser.password = await newUser.encryptPassword("0123");
    await newUser.save();
    req.flash("success_msg", "Registro de Usuario Coordinador exitoso.");
  
   
  } 


  res.render('index');
});




module.exports = router;
