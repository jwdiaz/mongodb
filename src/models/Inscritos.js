const mongoose = require('mongoose');
const { Schema } = mongoose;

const InscritoSchema = new Schema({
 
  IdCurso : {type: Schema.ObjectId, ref: 'Curso' },
  IdUsers : {type: Schema.Types.ObjectId, ref: 'User' },
  documento : { type: String, required: true },
  identificadorCurso : { type: String, required: true  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inscritos', InscritoSchema);
