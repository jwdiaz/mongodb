socket = io();

// socket.on("texto", text => {
//   usernames.innerHTML =
//     usernames.innerHTML +
//     "<strong>" +
//     text.nick +
//     "</strong>  se a conectado <br>";
// });

//socket.emit("contador")

var param = new URLSearchParams(window.location.search);
var nickusuario = param.get("nickname");

socket.on("connect", () => {
  socket.emit("usuarioNuevo", nickusuario);
});

socket.on("nuevoUsuario", text => {
  chat.innerHTML =
    chat.innerHTML + "----------<em>" + text + " </em>---------<br>";
});

socket.on("usuarioDesconectado", texto => {
  chat.innerHTML =
    chat.innerHTML + "----------<em>" + texto + " </em>---------<br>";
});

const formulario = document.querySelector("#formulario");
const mensaje = formulario.querySelector("#texto");
const chat = document.querySelector("#chat");

formulario.addEventListener("submit", datos => {
  datos.preventDefault();
  const texto = datos.target.elements.texto.value;
  const nick = datos.target.elements.nick.value;

  socket.emit(
    "texto",
    {
      nick: nick,
      mensaje: texto
    },
    () => {
      mensaje.value = "";
      mensaje.focus();
    }
  );
});

socket.on("texto", text => {
  chat.innerHTML =
    chat.innerHTML +
    "<strong>" +
    text.nick +
    "</strong>: <em>" +
    text.mensaje +
    "</em><br>";
});
