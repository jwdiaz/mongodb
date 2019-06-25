const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/tdea', {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('Base de datos conectado'))
  .catch(err => console.error(err));
