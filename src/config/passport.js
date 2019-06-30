const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/User'); 

passport.use(new LocalStrategy({
  usernameField: 'documento'
}, async (documento, password, done) => {
   
  const user = await User.findOne({documento: documento});

 
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado.' });
  } else {
    // validacion contraseña de usuario
    const match = await user.matchPassword(password);
    if(match) {

      

      return done(null, user);
    } else {
      return done(null, false, { message: ' Contraseña incorrecta.' });
    }
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
