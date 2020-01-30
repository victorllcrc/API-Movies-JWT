const passportJWT = require('passport-jwt')

const config = require('./../../config')
const usuarioController = require('../controllers/usuarios/usuarios.controller')

let jwtOptions = {
    secretOrKey:config.jwt.secreto,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy (jwtOptions,(jwtPayload, next)=>{

    usuarioController.obtenerUsuario({ id: jwtPayload.id })
    .then(usuario =>{
        if (!usuario){
            console.log(`JWT token no es valido. Usuario con id ${jwtPayload.id} no existe`)
            next(null, false)
            return
        }
        
        console.log(`Usuario ${usuario.username} suministro un token valido. Autentication completada.`)
        next(null, {
            username:usuario.username,
            id: usuario.id
        })
    })
    .catch(err=>{
        console.log("Error ocurrio al tratar de validar el token.", err)
        next(err)
    })
})
