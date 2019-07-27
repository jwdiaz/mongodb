const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect((process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/curso'), {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('Base de datos conectado'))
  .catch(err => console.error(err));
