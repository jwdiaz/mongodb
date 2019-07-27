const {UsuariosChat} = require('./usuariosChat');
const usuarios = new UsuariosChat();


module.exports = function (io){

io.on("connection", client => {
   
    
     client.on("usuarioNuevo", (usuario) => {
       if(usuario){
      let listado = usuarios.agregar(client.id,usuario);
       //console.log(listado)
       let text = 'Se ha conectado '+ usuario;
       //console.log(text)
       io.emit('nuevoUsuario',text)
       }
     });

     client.on('disconnect',()=>{
     
       let usuarioBorrado = usuarios.borrarUser(client.id)
       if(usuarioBorrado){

       let texto =' se ha desconectado ' + usuarioBorrado.nombre;
       io.emit('usuarioDesconectado',texto);
       }
     })
   
     client.on("texto", (text, callback) => {
     
       io.emit("texto", (text))
       callback()
     });
   });
}