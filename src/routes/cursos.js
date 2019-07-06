const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../helpers/auth");
// Models
const Curso = require("../models/Curso");
const Usuario = require("../models/User");
const inscripcion = require("../models/Inscritos");

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

router.get("/ver-cursos", isAuthenticated, async (req, res) => {
  const Cursos = await Curso.find();

  res.render("cursos/todoscursos", {
    Cursos
  });
});

router.get("/estado-cursos/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const Cursos = await Curso.find();
  res.send("ok asiganar estado curso");

  //res.redirect("/ver-cursos");
});

router.get("/curso/delete/:id", async (req, res) => {
  await Curso.findByIdAndRemove(req.params.id);
  req.flash("success_msg", "Curso eliminado con exito.");
  res.redirect("/ver-cursos");
});

router.get("/actualizarCurso/:id", async (req, res) => {
  const curso = await Curso.findById(req.params.id);

  res.render("cursos/actualizar-curso", { curso });
});

router.post("/cursos/new", isAuthenticated, async (req, res) => {
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
    req.flash("success_msg", "Registro de Curso exitoso.");

    res.redirect("/ver-cursos");
  }
});

router.put("/cursos/actualizar/:id", async (req, res) => {
  const {
    idCurso,
    nombre,
    descripcion,
    valor,
    modalidad,
    intensidadHoraria,
    estado
  } = req.body;
  await Curso.findByIdAndUpdate(req.params.id, {
    idCurso,
    nombre,
    descripcion,
    valor,
    modalidad,
    intensidadHoraria,
    estado
  });
  req.flash("success_msg", "Actualizacion de curso exitosa");
  res.redirect("/ver-cursos");
});

router.get("/curso/estado/:id/:estad", async (req, res) => {
  const idcurso = req.params.id;
  const estadoCurso = req.params.estad;

  res.locals.miCurso = req.params.id;
  

  if (estadoCurso == "Disponible") {
    const docente = await Usuario.find({ tipo: "Docente" });

    res.render("cursos/estadoCurso", { docente });
  } else {
    var estado = "Disponible";
    await Curso.findByIdAndUpdate(idcurso, { estado });
    req.flash("success_msg", "Actualizacion de estado curso exitosa");
    res.redirect("/ver-cursos");

    //pendiente eliminar el docente que estaba asignado al curso cerrado: :(
  }
});

router.put("/curso/actualizarEstado/:idCurso", async (req, res) => {
  var idCurso = req.params.idCurso;
  var idUsuario = req.body.idUser;

  usuario = await Usuario.findOne({ _id: idUsuario });
  curso = await Curso.findOne({ _id: idCurso });
  inscr = await inscripcion.find({
    IdUsers: idUsuario,
    IdCurso: req.body.idCurso
  });

  if (!inscr.length) {
    const newInscripcion = new inscripcion({
      IdCurso: idCurso,
      IdUsers: idUsuario,
      documento: usuario.documento,
      identificadorCurso: curso.idCurso
    });

    await newInscripcion.save(function(err) {
      if (err) return handleError(err);

      req.flash("success_msg", "Asignación de curso exitosa.");
    });
    var estado = "Cerrado";
    await Curso.findByIdAndUpdate(idCurso, { estado });
    req.flash("success_msg", "Actualización de estado curso exitosa");
    res.redirect("/ver-cursos");
  } else {
    req.flash(
      "error_msg",
      "Ya el usuario realizó una inscripción al curso seleccionado."
    );
    res.redirect("/ver-cursos");
  }
});

module.exports = router;
