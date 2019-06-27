const express = require("express");
const router = express.Router();
const Usuario = require("../models/User");
const inscripcion = require("../models/Inscritos");
const Curso = require("../models/Curso");

router.get("/inscribir", async (req, res) => {
  const curso = await Curso.find({
    estado: "Disponible"
  }).sort({
    nombre: 1
  });

  res.render("inscripcion/listar-cursos", {
    curso
  });
});

module.exports = router;