const express = require("express");
const router = express.Router();
const Usuario = require("../models/User");
const inscripcion = require("../models/Inscritos");
const Curso = require("../models/Curso");

router.get("/inscribir/aspirante", async (req, res) => {
  const cursos = await Curso.find({
    estado: "Disponible"
  }).sort({
    nombre: 1
  });

  res.render("inscripcion/listar-cursos", {
    cursos
  });
});

router.put("/inscribir/aspirante/:idUser", async (req, res) => {
  var idCurso = req.body.idCurso;
  var idUsuario = req.params.idUser;

  const newInscripcion = new inscripcion({
    IdCurso: idCurso,
    IdUsers: idUsuario
  });
  //  console.log(newInscripcion);

  await newInscripcion.save(function(err) {
    if (err) return handleError(err);

    req.flash("success_msg", "Incripción  exitosa.");

    res.redirect("/inscribir/aspirante");
  });
});

router.get("/inscripcion/misCursos/:idUser", async (req, res) => {
  var idUsuario = req.params.idUser;
  const misCursos = inscripcion.findOne({ idUser: idUsuario });

 // console.log(misCursos);

  res.render("inscripcion/misCursos", {
    misCursos
  });

});

module.exports = router;
