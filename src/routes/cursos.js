const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');
// Models
const Curso = require("../models/Curso");


router.get("/cursos", async (req, res) => {
  const curso = await Curso.find({
    estado: "Disponible"
  }).sort({
    nombre: 1
  });

  res.render("cursos/listar-cursos", {
    curso
  });
});

router.get("/new-curso", isAuthenticated, (req, res) => {
  res.render("cursos/crear-cursos");
});

router.get("/ver-curso/:id", async (req, res) => {
  const id = req.params.id;
  const infoCurso = await Curso.find({
    idCurso: id
  });

  res.render("cursos/ver-curso", {
    infoCurso
  });
});

router.get("/ver-cursos", async (req, res) => {
  const Cursos = await Curso.find();

  res.render("cursos/todoscursos", {
    Cursos
  });
});

router.get("/estado-cursos/:id", async (req, res) => {
  const id = req.params.id;
  const Cursos = await Curso.find();
  res.send('ok asiganar estado curso');

  //res.redirect("/ver-cursos");
});

router.get("/curso/delete/:id", async (req, res) => {
  await Curso.findByIdAndRemove(req.params.id);
  req.flash('success_msg', 'Curso eliminado con exito.');
  res.redirect("/ver-cursos");
});

router.get("/actualizarCurso/:id", async (req, res) => {
  const curso = await Curso.findById(req.params.id);

  res.render("cursos/actualizar-curso", { curso });
});

router.post("/cursos/new", async (req, res) => {
  const body = req.body;

  // Saving a New curso

  const exiCurso = await Curso.findOne({ idCurso: body["idCurso"] });
  if (exiCurso) {
    req.flash("error_msg", "Ya exite un curso con el ID :" + body["idCurso"]);
    res.redirect("/new-curso");
  } else {
    const newCurso = new Curso({
      idCurso: body["idCurso"],
      nombre: body["nombre"],
      descripcion: body["descripcion"],
      valor: body["valor"],
      intensidad: body["intensidadHoraria"],
      modalidad: body["modalidad"]
    });
    await newCurso.save();
    req.flash('success_msg', 'Registro de Curso exitoso.');

    res.redirect("/ver-cursos");
  }
});


router.put("/cursos/actualizar/:id", async (req, res) => {
  const { idCurso, nombre, descripcion, valor, modalidad, intensidadHoraria, estado } = req.body;
  await Curso.findByIdAndUpdate(req.params.id, { idCurso, nombre, descripcion, valor, modalidad, intensidadHoraria, estado });
  req.flash('success_msg', 'Actualizacion de curso exitosa');
  res.redirect("/ver-cursos");

});



module.exports = router;
