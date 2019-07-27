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
var usuarioAc = document.querySelector("#usuarioActual");
var nickusuarioactual = '';
if(usuarioAc != null){
    nickusuarioActual = usuarioAc.value;
}

socket.on("connect", () => {
  if($("#hacia") && $("#hacia").val()){
      socket.emit("enviarInvitacion", { desde: $("#usuarioActual").val(), hacia: $("#hacia").val()});
  }
  else{
      socket.emit("usuarioNuevo", nickusuario);
  }
});

socket.on("enviarInvitacion", info => {
    link = "<a href='/users/chat-privado/"+ info.desde + "'>El usuario " + info.desde + " te ha enviado una invitación de chat privada, has click aquí para aceptarla.</a>";
    if($("#usuarioActual").val().trim() == info.hacia.trim() && formulario_privado == null){
        chat.innerHTML =
            chat.innerHTML + "----------<em>" + link + " </em>---------<br>";
    }
});

socket.on("nuevoUsuario", text => {
  link = "<a href='/users/chat-privado/"+ text + "'>Se ha conectado " + text + "</a>";
  chat.innerHTML =
    chat.innerHTML + "----------<em>" + link + " </em>---------<br>";
});

socket.on("usuarioDesconectado", texto => {
  chat.innerHTML =
    chat.innerHTML + "----------<em>" + texto + " </em>---------<br>";
});

const formulario = document.querySelector("#formulario");
var mensaje = "";
var chat = "";
if(document != null){
  chat = document.querySelector("#chat");
  if(chat == null){
      chat = document.querySelector("#chatprivado");
  }
}

if(formulario != null){
  mensaje = formulario.querySelector("#texto");
}


const formulario_privado = document.querySelector("#formulario_privado");
if(formulario_privado != null){
    mensaje = formulario_privado.querySelector("#texto");
}

if(formulario != null){
  formulario.addEventListener("submit", datos => {
    datos.preventDefault();
    const texto = datos.target.elements.texto.value;
    const nick = datos.target.elements.nick.value;

    socket.emit(
        "texto",
        {
          nick: nick,
          mensaje: texto,
          privado: false
        },
        () => {
          mensaje.value = "";
          mensaje.focus();
        }
    );
  });
}

if(formulario_privado != null) {
  formulario_privado.addEventListener("submit", datos => {
    datos.preventDefault();
    const texto = datos.target.elements.texto.value;
    const nick = datos.target.elements.nick.value;
    const hacia = $("#hacia").val();
      socket.emit(
        "textoPrivado",
        {
          nick: nick,
          mensaje: texto,
          desde: hacia,
          privado: true
        },
        () => {
          mensaje.value = "";
          mensaje.focus();
        }
      );
  });

}

socket.on("textoPrivado", text => {
    if(text.nick.trim() == usuarioAc.value.trim() || text.desde.trim() == usuarioAc.value.trim() && text.privado && formulario == null){
        chat.innerHTML =
            chat.innerHTML +
            "<strong>" +
            text.nick +
            "</strong>: <em>" +
            text.mensaje +
            "</em><br>";
    }
});

socket.on("texto", text => {
    if(formulario != null && ! text.privado){
        chat.innerHTML =
            chat.innerHTML +
            "<strong>" +
            text.nick +
            "</strong>: <em>" +
            text.mensaje +
            "</em><br>";
    }
});


