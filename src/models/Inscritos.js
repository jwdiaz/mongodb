const mongoose = require('mongoose');
const { Schema } = mongoose;

const InscritoSchema = new Schema({
 
  IdCurso : {type: Schema.ObjectId, ref: 'Curso' },
  idUsers : {type: Schema.Types.ObjectId, ref: 'user' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inscritos', InscritoSchema);
