const express = require('express')
const bcrypt =require('bcrypt')
const jwt = require ('jsonwebtoken')

const validarUsuario = require('./usuarios.validate').validarUsuario
const validarPedidoDeLogin = require('./usuarios.validate').validarPedidoDeLogin
const validarId = require('./../../helpers/validarId').validarId
const transformarBodyALowerCase = require('./../../helpers/validarId').transformarBodyALowerCase
const config = require('./../../../config')
const  usuarioController = require('./usuarios.controller')

const usuariosRouter = express.Router()

//************* MODELOS PARA EL SWAGGER *************

/**
 * @swagger
 * definitions: 
 *   usuarioCandidato : 
 *     type : "object" 
 *     properties : 
 *       username : 
 *         type : "string"
 *         minLength : 1
 *       password : 
 *         type : "string"
 *         minLength : 1
 *       email : 
 *         type : "string"
 *         minLength : 1
 *     required : [ "username", "password", "email" ]
 *   
 *   usuario : 
 *     type : "object"
 *     properties : 
 *       id : 
 *         type : "number" 
 *       username : 
 *         type : "string"
 *         minLength : 1
 *       password : 
 *         type : "string"
 *         minLength : 1
 *       email : 
 *         type : "string"
 *         minLength : 1
 *     required : [ "id", "username", "password", "email" ]
 *   
 *   usuarioLogin : 
 *       type : "object"
 *       properties : 
 *           username : 
 *               type : "string"
 *               minLength : 1
 *           password : 
 *               type : "string"
 *               minLength : 1
 *       required : [ "username", "password" ]
 *   
 *   GetUsuarioListResponse:
 *      properties:
 *          usuarios:
 *              type: array
 *              items:
 *                  $ref: "#/definitions/usuario"
 *      required: ["usuarios"] 
 *   TokenResponse:
 *      properties:
 *          token:
 *              type: string 
 *      required: ["token"]
 *   MessageExito:
 *      properties:
 *          messageExito:
 *              type: string 
 *      required: ["messageExito"]     
 * 
 */


//************* DEFINICION DE RUTA PARA /usuario SWAGGER *************

/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags: [ "Usuarios" ]
 *     description: retorna todas los usuarios registrados
 *     responses:
 *       '200':
 *         description: retorna una lista con todos los usuarios
 *         schema:
 *             $ref: "#/definitions/GetUsuarioListResponse"  
 *       '500':
 *         description: retorna un mensaje de error
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *   post:
 *     tags: [ "Usuarios" ]
 *     description: Crea un nuevo usuario
 *     parameters : [ {
 *         "in" : "body",
 *         "name" : "UsuarioCandidato",
 *         "description" : "verifica la existencia y luego crea el usuario",
 *         "required" : true,
 *         "schema" : {
 *           "$ref" : "#/definitions/usuarioCandidato"
 *         }
 *     } ] 
 *     responses:
 *       '201':
 *         description: retorna un mensaje exitoso
 *         schema:
 *             $ref: "#/definitions/MessageExito" 
 *       '500':
 *         description: retorna un mensaje de fallo de procesamiento
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *       '409':
 *         description: retorna un mensaje de informacion duplicada
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"  
 */

usuariosRouter.get('/', async(req, res)=>{
    let usuarios

    try {
        usuarios = await usuarioController.obtenerUsuarios()
    } catch (err) {
        console.log('Error al obtener todos los usuarios', err)
        res.status(500)
        return
    }

    res.json(usuarios)
})

usuariosRouter.post('/',[validarUsuario, transformarBodyALowerCase], async(req, res)=>{
    let nuevoUsuario = req.body
    let usuarioExiste

    try {
        usuarioExiste = await usuarioController.usuarioExiste(nuevoUsuario.username, nuevoUsuario.email)
    } catch (err) {
        console.log(`Error ocurrio al tratar de verificar si usuario [${nuevoUsuario.username}] con email [${nuevoUsuario.email}] ya existen.`)
        res.status(500).send(`Error ocurrio al tratar de crear nuevo usuario.`)
        return
    }

    if(usuarioExiste){
        console.log(`WARN:Email [${nuevoUsuario.email}] o username [${nuevoUsuario.username}] ya existe en la base de datos`)
        res.status(409).send('El email o usuario ya estan asociados con una cuenta')
        return
    }

    bcrypt.hash(nuevoUsuario.password, 10, async(err, hashedPassword)=>{
        if(err){
            console.log("Error ocurrio al tratar de obtener el hash de una  contraseña", err)
            res.status(500).send("Error procesando creacion del usuario.")
            return
        }

        try {
            await usuarioController.crearUsuario(nuevoUsuario,hashedPassword)
        } catch (err) {
            console.log("Error ocurrio al tratar de crear nuevo usuario", err)
            res.status(500).send("Error ocurrio al tratar de crear nuevo usuario.")
            return
        }
        res.status(201).send("Usuario creado exitosamente")
    })  
})

//************* DEFINICION DE RUTA PARA /usuario/{id} SWAGGER *************

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags: [ "Usuarios" ]
 *     description: Nos retorna un usuario por su id
 *     parameters: [{
 *       "in": "path",
 *       "name": "id",
 *       "description": "identificador de un usurio",
 *       "required" : true,
 *       "type" : "string"  
 *     }]
 *     responses:
 *       '200':
 *         description: retorna el objeto con el id indicado
 *         schema:
 *             $ref: "#/definitions/usuario" 
 *       '500':
 *         description: error ocurrio obteniendo usuario con id
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *       '404':
 *         description: usuario no existe 
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"     
 */


usuariosRouter.get('/:id',validarId, async(req, res) => {
    let id = req.params.id
    let usuario

    try {
        usuario= await usuarioController.obtenerUsuario({id:id})
    } catch (err) {
        console.log(`WARN:Excepcion ocurrio al tratar de obtener usuario con id[${id}]`, err)
        res.status(500).send(`Error ocurrio obteniendo usuario con id [${id}]`)
        return
    }

    if(!usuario){
        res.status(404).send(`Usuario con id [${id}] no existe.`)
    }else{
        console.log("gaaa")
        res.json(usuario)
    }
})


/**
 * @swagger
 * 
 * /usuarios/login:
 *   post:
 *     tags: [ "Login" ]
 *     parameters : [ {
 *      "in" : "body",
 *        "name" : "UsuarioLogin",
 *        "description" : "Genera token",
 *        "required" : true,
 *        "schema" : {
 *          "$ref" : "#/definitions/usuarioLogin"
 *        }
 *     } ]
 *     responses:
 *        '200':
 *          description: Retorna el TOKEN
 *          schema:
 *             $ref: "#/definitions/TokenResponse" 
 *        '400':
 *          description: Retorna un mensaje para que verifique la informacion enviada
 *          schema:
 *             $ref: "#/definitions/ErrorResponse"
 *        '500':
 *          description: Retorna un mensaje de fallo de procesamiento
 *          schema:
 *             $ref: "#/definitions/ErrorServer"
 *
 */

usuariosRouter.post('/login',[validarPedidoDeLogin, transformarBodyALowerCase], async(req, res)=>{
    let usuarioNoAutenticado = req.body
    let usuarioRegistrado

    try{
        usuarioRegistrado = await usuarioController.obtenerUsuario({
            username: usuarioNoAutenticado.username
        })
    }catch(err){
        console.log(`Error ocurrio al tratar de determiner si el usuario [${usuarioNoAutenticado.username}] ya existe`, err)
        res.status(500).send('Error ocurrio durante el proceso de login.')
        return
    }

    if(!usuarioRegistrado){
        console.log(`INFO:Usuario [${usuarioNoAutenticado.username}] no existe. NO pudo  ser autenticado`)
        res.status(400).send('Credenciales incorrectas. Asegurate que el username y  contraseña sean correctas')
        return
    }
    let contraseñaCorrecta
    try {
        contraseñaCorrecta = await bcrypt.compare(usuarioNoAutenticado.password, usuarioRegistrado.password)
    }catch (err){
        console.log(`Error ocurrio al tratar de verificar si la contraseña es  correcta`, err)
        res.status(500).send('Error ocurrio durante el proceso de login')
        return
    }

    if(contraseñaCorrecta){
        let token = jwt.sign({id: usuarioRegistrado.id},config.jwt.secreto,{ expiresIn: config.jwt.tiempoDeExpiracion})
        console.log(`INFO:Usuario ${usuarioNoAutenticado.username} completo autentificacion exitosamente`)
        res.status(200).json({token})
    }else{
        console.log(`INFO:Usuario ${usuarioNoAutenticado.username} no completo autentificacion , contraseña incorecta `)
        res.status(400).send("credenciales incorectas, asegurate que el username o password sean correctas")
    }
})


module.exports = usuariosRouter