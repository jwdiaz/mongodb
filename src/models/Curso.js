const mongoose = require('mongoose');
const { Schema } = mongoose;

const CursoSchema = new Schema({
 
  idCurso: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  intensidad: {
    type: String
  },
  modalidad: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    default: "Disponible"
    
  },
  docente: {type: Schema.Types.ObjectId, ref: 'user'},
  alumno: [{type: Schema.ObjectId, ref: 'user' }]
});

module.exports = mongoose.model('Curso', CursoSchema);
