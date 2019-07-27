const express = require("express");
const router = express.Router();
const Usuario = require("../models/User");
const inscripcion = require("../models/Inscritos");
const Certificado = require("../models/Certificado");
const Curso = require("../models/Curso");
const sgMail = require('@sendgrid/mail');

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

      sgMail.setApiKey(process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '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');
      const msg = {
        from: 'inscripcion-cursos@cursos.edu.co',
        to: usuario.correo,
        subject: 'Inscripción Satisfactoria',
        html: 'Hola <b>' + usuario.nombre + '</b><br/><br/>' + 'Se realizo correctamente la inscricpión al curso <b>' + curso.nombre + '</b> con intensidad horaria ' + curso.intensidad + ' horas, valor $' + curso.valor + ' y modalidad ' + curso.modalidad + '.<br/><br/> Ten un buen día.<br/><br/> Ate, Administración Plataforma' ,
      };
      sgMail.send(msg).then((sent) => {
      });
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

router.get("/inscripcion/certificado/:idCurso/:idUsuario", async (req, res) => {
    var idUsuario = req.params.idUsuario;
    var idCurso = req.params.idCurso;

    usuario = await Usuario.findOne({_id: idUsuario});
    curso = await Curso.findOne({_id: idCurso});
    res.render("inscripcion/certificado", {
        curso: curso,
        usuario: usuario
    });
});

var multer = require('multer')({
    dest: 'public/archivos'
});
var fs = require('fs');
var path = require('path');
var util = require('util');

function almacenar (archivo, insc) {
    var fullNewPath = path.join(archivo.destination, "documento_inscripcion_" + insc.IdCurso + "_" + insc.IdUsers + path.extname(archivo.originalname));
    var rename = util.promisify(fs.rename)
    return rename(archivo.path, fullNewPath)
        .then(() => {

            cert = new Certificado({
                inscripcion:  insc._id,
                rutaCertificado: fullNewPath,
                fechaSubida: new Date()
            });
            cert.save();
            return archivo.originalname
        })
}

router.post("/inscripcion/subir-certificado", [multer.single('certificado')], async (req, res, next) => {
    var idUsuario = req.body.id_usuario;
    var idCurso = req.body.id_curso;

    usuario = await Usuario.findOne({_id: idUsuario});
    curso = await Curso.findOne({_id: idCurso});

    inscrip = await inscripcion.findOne({IdUsers: idUsuario, IdCurso: idCurso});
    cert = await Certificado.findOne({inscripcion: inscrip._id});
    if(cert == null){
        return almacenar(req.file, inscrip)
            .then(encodeURIComponent)
            .then(encoded => {
                req.flash("success_msg", "Se guardo el certificado sin problema.");
                res.render("inscripcion/certificado", {
                    curso: curso,
                    usuario: usuario,
                    success_msg: "Se guardo el certificado sin problema."
                });
            })
            .catch(next)
    }
    else{
        req.flash("error_msg", "Ya subio un certificado para el curso seleccionado.");
        res.render("inscripcion/certificado", {
            curso: curso,
            usuario: usuario,
            error_msg: "Ya subio un certificado para el curso seleccionado."
        });
    }


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
  const aspirantes = await Usuario.find({tipo: "Aspirante"});


  res.render("inscripcion/misCursoAsignados", {
    Cursos: cursos,
        inscripciones: inscripciones,
        usuarios: aspirantes
  });
});


router.get("/cursos/inscripciones", async (req, res) => {

    const cursos = await Curso.find({});
    const inscrip = await inscripcion.find({});
    const usuarios = await Usuario.find({tipo: "Aspirante"});

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
