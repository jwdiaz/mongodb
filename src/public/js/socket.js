socket = io();

socket.on("mensaje",(informacion)=>{
    console.log(informacion);
});

socket.emit("contador")

document.querySelector('#formulario').addEventListener('submit',(datos)=>{
    datos.preventDefault();
    const texto = datos.target.elements.texto.value
    socket.emit('texto',texto)
})
socket.on("texto",(text)=>{
    console.log(text)
})