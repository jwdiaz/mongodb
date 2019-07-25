socket = io();

socket.on("mensaje", informacion => {
    console.log(informacion);
});

//socket.emit("contador")
const formulario = document.querySelector("#formulario");
const mensaje = formulario.querySelector("texto");
const chat = document.querySelector("#chat");

formulario.addEventListener("submit", datos => {
    datos.preventDefault();
    const texto = datos.target.elements.texto.value;
    const nombre = datos.target.elements.nombre.value;
    socket.emit(
        "texto", {
            nombre: nombre,
            mensaje: texto
        },
        () => {
            mensaje.value = "";
            mensaje.focus();
        }
    );
});

socket.on("texto", (text) => {
    console.log(text)
    chat.innerHTML = chat.innerHTML + text.nombre + ':' + text.mensaje + '<br>'
});