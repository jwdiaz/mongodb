const mongoose = require('mongoose');
const { Schema } = mongoose;

const InscritoSchema = new Schema({
  IdCurso: {
    type: String,
    required: true
  },
  documento: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Inscrito', InscritoSchema);
