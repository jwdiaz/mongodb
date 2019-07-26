class UsuariosChat{ 
    
    constructor(){
        this.usuarios = [];
    }

    agregar(id,nombre){
        let usuario ={id,nombre}
        this.usuarios.push(usuario)
        return this.usuarios
    }
    getUsers() {
        return this.usuarios
    }

    getUsers(id) {
        let usuario = this.usuarios.filter(user => user.id == id)[0]
        return usuario;
    }
    

    borrarUser(id){
        let userBorrado = this.getUsers(id)
        this.usuarios =this.usuarios.filter(user => user.id != id)
        return userBorrado
    
    }
}

module.exports = {
    UsuariosChat
}