const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require("./config/database");
require("./config/passport");

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  hbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require('./helpers/hbs-helpers')
  })
);

io.on('connection', client =>{
  console.log('un usuario se ha conectado');

  client.on("texto",(text)=>{
    console.log(text)
    io.emit("texto",text)
  })
});

app.set("view engine", ".hbs");

// middlewares

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;


  next();
});

// routes
app.use(require("./routes"));
app.use(require("./routes/users"));
app.use(require("./routes/cursos"));
app.use(require("./routes/inscripcion"));

app.use(express.static(path.join(__dirname, "public")));

server.listen(app.get("port"), () => {
  console.log("Escuchando puerto ", app.get("port"));
});
