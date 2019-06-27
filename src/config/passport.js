const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/User'); 

passport.use(new LocalStrategy({
  usernameField: 'documento'
}, async (documento, password, done) => {
  var admin = false; 
  
  const use = await User.findOne({documento: documento});

 if(use.tipo ==="Docente"){
   admin=true;
 }

  if (!use) {
    return done(null, false, { message: 'Usuario no encontrado.' });
  } else {
    // validacion contraseña de usuario
    const match = await use.matchPassword(password);
    if(match) {

      return done(null, use);
    } else {
      return done(null, false, { message: ' Contraseña incorrecta.' });
    }
  }

}));

passport.serializeUser((use, done) => {
  done(null, use.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, use) => {
    done(err, use);
  });
});
