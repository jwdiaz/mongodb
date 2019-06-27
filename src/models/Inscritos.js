const mongoose = require('mongoose');
const { Schema } = mongoose;

const InscritoSchema = new Schema({
  IdCurso: {type: Schema.Types.ObjectId, ref: 'Curso' },
  _users    : [{type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Inscritos', InscritoSchema);
