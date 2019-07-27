const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertificadoSchema = new Schema({
  inscripcion : {type: Schema.Types.ObjectId, ref: 'Inscritos' },
  rutaCertificado : { type: String, required: true },
  fechaSubida: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificado', CertificadoSchema);
