const mongoose = require('mongoose');
const { Schema } = mongoose;

//const bcrypt = require('bcryptjs');

const Usuario = new Schema({
  documento: { type: String, required: true },
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  tipo: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

Usuario.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

Usuario.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', Usuario);
