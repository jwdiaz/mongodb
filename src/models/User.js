const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
  documento: { type: String, required: true },
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String },
  password: { type: String, required: true },
  tipo: { type: String, default:"Aspirante" },
  inscripcion   : [{type: Schema.Types.ObjectId, ref: 'Inscritos' }]
});

UsuarioSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

UsuarioSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UsuarioSchema);
