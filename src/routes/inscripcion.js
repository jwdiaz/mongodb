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

  usuario = await Usuario.findOne({_id: req.params.idUser});
  curso = await Curso.findOne({_id: req.body.idCurso});
  inscr = await inscripcion.find({IdUsers: req.params.idUser, IdCurso: req.body.idCurso});

  if(! inscr.length){
    const newInscripcion = new inscripcion({
      IdCurso: idCurso,
      IdUsers: idUsuario,
      documento: usuario.documento,
      identificadorCurso: curso.idCurso
    });

    await newInscripcion.save(function(err) {
      if (err) return handleError(err);

      req.flash("success_msg", "Incripción  exitosa.");

      res.redirect("/inscribir/aspirante");
    });
  }
  else{
    req.flash("error_msg", "Ya el usuario realizó una inscripción al curso seleccionado.");
    res.redirect("/inscribir/aspirante");
  }

});

router.get("/inscripcion/misCursos/:idUser", async (req, res) => {
  var idUsuario = req.params.idUser;
  const usuario = await Usuario.findOne({ _id: idUsuario });
  inscrip = await inscripcion.find({ documento: usuario.documento });
  inscrip = inscrip.map(obj => obj.IdCurso);
  const cursos = await Curso.find({_id: { $in : inscrip }});

  res.render("inscripcion/misCursos", {
    MisCursos: cursos,
    idUsuario: idUsuario
  });
});

router.get("/inscripcion/delete/:idCurso/:idUsuario", async (req, res) => {
    var idUsuario = req.params.idUsuario;
    var idCurso = req.params.idCurso;
    objectidUsuario = new require('mongoose').Types.ObjectId(idUsuario);
    objetoidCurso = new require('mongoose').Types.ObjectId(idCurso);
    inscrip = await inscripcion.deleteOne({ IdCurso: objetoidCurso, IdUsers:  objectidUsuario});
    const usuario = await Usuario.findOne({ _id: idUsuario });
    inscrip = await inscripcion.find({ documento: usuario.documento });
    inscrip = inscrip.map(obj => obj.IdCurso);
    const cursos = await Curso.find({_id: { $in : inscrip }});
    req.flash("success_msg", "Se eliminó el registro sin problema.");
    res.render("inscripcion/misCursos", {
        MisCursos: cursos,
        idUsuario: idUsuario
    });
});

router.get("/cursos/asignados/:idUser", async (req, res) => {
  var idUsuario = req.params.idUser;
  const usuario = await Usuario.findOne({ _id: idUsuario });
  inscrip = await inscripcion.find({ documento: usuario.documento });
  inscrip = inscrip.map(obj => obj.IdCurso);
  const cursos = await Curso.find({_id: { $in : inscrip }});
  const inscripciones = await inscripcion.find({});
  const aspirantes = await Usuario.find({});


  res.render("inscripcion/misCursoAsignados", {
    Cursos: cursos,
        inscripciones: inscripciones,
        usuarios: aspirantes
  });
});


router.get("/cursos/inscripciones", async (req, res) => {

    const cursos = await Curso.find({});
    const inscrip = await inscripcion.find({});
    const usuarios = await Usuario.find({});

    res.render("inscripcion/inscripciones", {
        Cursos: cursos,
        inscripciones: inscrip,
        usuarios: usuarios
    });
});

router.get("/inscripcion/eliminar/:id", async (req, res) => {
    var id = req.params.id;
     await inscripcion.deleteOne({ _id: id });

    req.flash("success_msg", "Incripción  eliminada con exito.");

    res.redirect("/cursos/inscripciones");
   
});


module.exports = router;
