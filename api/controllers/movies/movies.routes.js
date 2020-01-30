const express = require('express')
const passport = require('passport')

const validarMovie = require('./movies.validate')
const movieController = require('./movies.controller')
const validarId = require('./../../helpers/validarId').validarId

const jwtAuthenticate = passport.authenticate('jwt',{ session:false })
const moviesRouter = express.Router()

//************* MODELOS PARA EL SWAGGER *************

/**
 * @swagger
 * definitions:
 *   movieCandidato:
 *      type: object
 *      properties: 
 *          title:
 *              type: string
 *          country:
 *              type: string
 *          language:
 *              type: string
 *          genre:
 *              type: string
 *          year:
 *              type: number
 * 
 *      required: ["title", "country", "language", "genre", "year"]
 *   movie:
 *      type: object
 *      properties:
 *          id:
 *              type:string 
 *          title:
 *              type: string
 *          country:
 *              type: string
 *          language:
 *              type: string
 *          genre:
 *              type: string
 *          year:
 *              type: number
 *          dueño:
 *              type:string
 * 
 *      required: ["id", "title", "country", "language", "genre", "year", "dueño"]
 *   GetMoviesListResponse:
 *      properties:
 *          movies:
 *              type: array
 *              items:
 *                  $ref: "#/definitions/movie"
 *      required: ["movies"]
 *   ErrorResponse:
 *      properties:
 *          message:
 *              type: string 
 *      required: ["message"]
 *   ErrorServer:
 *      properties:
 *          message:
 *              type: string 
 *      required: ["message"]
 *         
 */


//************* DEFINICION DE RUTA PARA /movies SWAGGER *************

/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [ "Movies" ]
 *     description: retorna todas las peliculas
 *     responses:
 *       '200':
 *         description: retorna una lista con todos las peliculas
 *         schema:
 *             $ref: "#/definitions/GetMoviesListResponse" 
 *       '500':
 *         description: error al  leer las peliculas de la base de datos
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *   post:
 *     tags: [ "Movies" ]
 *     description:  crea una nueva pelicula
 *     parameters: [ {
 *         "in" : "body",
 *         "name" : "movieCandidato",
 *         "description" : "verifica la existencia y luego crea el usuario",
 *         "required" : true,
 *         "schema" : {
 *           "$ref" : "#/definitions/movieCandidato"
 *         }
 *     } ]  
 *     security : [ {
 *        "Bearer" : [ ]
 *     } ]     
 *     responses:
 *       '201':
 *         description: retorna la pelicula creada
 *         schema:
 *             $ref: "#/definitions/movie"  
 *       '500':
 *         description: retorna un mensaje de error
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *       '400':
 *         description: retorna un mensaje de error de validacion 
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"        
 * 
 */


moviesRouter.get('/', async(req, res) => {
    let movie

    try {
        movie = await movieController.obtenerMovies()
    } catch (err) {
        res.status(500).send("error al  leer las peliculas de la base de datos")
        return
    }

    res.json(movie)
})


moviesRouter.post('/', [jwtAuthenticate, validarMovie], async(req, res) => {
    let movie
    try {
        movie = await movieController.crearMovie(req.body, req.user.username )
    } catch (err) {
        console.log("ERROR:Pelicula no pudo ser creado", err)
        res.status(500).send("Error ocurrio al tratar de crear la pelicula.")
        return
    }

    console.log('INFO:Pelicula agregado a la coleccion peliculas', movie)
    res.status(201).json(movie)    
})


//************* DEFINICION DE RUTA PARA /movies/{id} SWAGGER *************

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags: [ "Movies" ]
 *     description: retorna una pelicula segun el id
 *     parameters: [{
 *       "in": "path",
 *       "name": "id",
 *       "description": "identificador de una pelicula",
 *       "required" : true,
 *       "type" : "string"  
 *     }]
 *     responses:
 *       '200':
 *         description: retorna una pelicula
 *         schema:
 *             $ref: "#/definitions/movie" 
 *       '404':
 *         description: retorna un mensaje de error
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"   
 *       '500':
 *         description: error al obtener la pelicula
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *   put:
 *     tags: [ "Movies" ]
 *     description:  Actualiza una pelicula
 *     parameters: [ {
    *       "in": "path",
    *       "name": "id",
    *       "description": "identificador de una pelicula",
    *       "required" : true,
    *       "type" : "string"  
 *     },{
 *         "in" : "body",
 *         "name" : "movieCandidato",
 *         "description" : "verifica la existencia y luego actualiza la pelicula",
 *         "required" : true,
 *         "schema" : {
 *           "$ref" : "#/definitions/movieCandidato"
 *         }
 *     } ]  
 *     security : [ {
 *        "Bearer" : [ ]
 *     } ]     
 *     responses:
 *       '200':
 *         description: retorna la pelicula actualizada con exito
 *         schema:
 *             $ref: "#/definitions/movie" 
 *       '500':
 *         description: retorna un mensaje de fallo de procesamiento de la pelicula
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *       '404':
 *         description: retorna un mensaje de no existencia de pelicula
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"  
 *       '401':
 *         description: retorna un mensaje de no pertenencia entre usuario y pelicula
 *         schema:
 *             $ref: "#/definitions/ErrorResponse" 
 *   delete:
 *     tags: [ "Movies" ]
 *     description: elimina la pelicual segun el id
 *     parameters: [{
 *       "in": "path",
 *       "name": "id",
 *       "description": "identificador de una pelicula",
 *       "required" : true,
 *       "type" : "string"  
 *     }]
 *     security : [ {
 *        "Bearer" : [ ]
 *     } ]  
 *     responses:
 *       '200':
 *         description: retorna un mensaje de borrado exitosamente
 *         schema:
 *             $ref: "#/definitions/movie" 
 *       '404':
 *         description: retorna un mensaje de no existencia de pelicula
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"  
 *       '401':
 *         description: retorna un mensaje de no pertenencia entre usuario y pelicula 
 *         schema:
 *             $ref: "#/definitions/ErrorResponse"    
 *       '500':
 *         description: retorna un mensaje de fallo de procesamiento de la pelicula
 *         schema:
 *             $ref: "#/definitions/ErrorServer" 
 *   
 */

 
moviesRouter.get('/:id',validarId, async(req, res) => {
    let id = req.params.id
    let movie
    try {
        movie = await movieController.obtenerMovie(id)
    } catch (err) {
        console.log(`Excepcion ocurrio al tratar de obtener pelicula con id[${id}]`, err)
        res.status(500).send(`Error ocurrio obteniendo pelicula con id [${id}]`)
        return
    }

    if(!movie){
        res.status(404).send(`Pelicula con id [${id}] no existe.`)
    }else{
        res.status(200).json(movie)
    }
    
})


moviesRouter.put('/:id',[jwtAuthenticate, validarMovie], async(req, res) => {
    let id = req.params.id
    let requestUsuario = req.user.username
    let movieAReemplazar

    try{
        movieAReemplazar = await movieController.obtenerMovie(id)
    }catch (err){
        console.log(`WARN:Exception ocurrio al procesar la modificacion de la pelicula con id [${id}]`, err)
        res.status(500).send(`Error ocurrio modificando pelicula con id [${id}]`)
        return
    }
    
    if(!movieAReemplazar){
        res.status(404).send(`La pelicula con id [${id}] no existe`)
        return
    }
    
    if(movieAReemplazar.dueño !== requestUsuario){
        console.log(`Usuario [${requestUsuario}] no es dueño de la pelicula con id [${id}]. Dueño real es
        [${movieAReemplazar.dueño}]. Request no sera procesado`)
        res.status(401).send(`No eres dueño de la pelicula con id [${id}]. Solo puedes modificar peliculas creado por ti`)
        return
    }

    movieController.reemplazarMovie(id, req.body, requestUsuario)
    .then(movie=>{
        res.status(200).json(movie)
        console.log(`INFO:Pelicula con id [${id}] reemplazado con la nueva pelicula`, movie)
    })
    .catch(err =>{
        console.log(`ERROR:Excepcion al tratar de reemplazar pelicula con id [${id}]`, err)
        res.status(500).send(`Error ocurrio reemplazando pelicula con id [${id}]`)
    })
})


moviesRouter.delete('/:id',[jwtAuthenticate, validarId], async(req, res) => {
    let id = req.params.id
    let movieABorrar

    try{
        movieABorrar = await movieController.obtenerMovie(id)

    }catch (err){
        console.log(`WARN:Excepcion ocurrio al procesar el borrado de la pelicula con id [${id}]`, err)
        res.status(500).send(`Error ocurrio borrando la pelicula con id [${id}]`)
    }
    
    if (!movieABorrar) {
        console.log(`INFO: Pelicula con id [${id}] no existe, Nada que borrar`)
        res.status(404).send(`Pelicula con id [${id} no existe. Nada que borrar.]`)
        return
    }
    
    let usuarioAutenticado = req.user.username

    if(movieABorrar.dueño !== usuarioAutenticado){
        console.log(`INFO: Usuaraio [${usuarioAutenticado}] no es duño de la pelicula con id [${id}].
        Dueno real es [${movieABorrar.dueño}]. Request no sera procesado`)
        res.status(401).send (`No eres dueño de la pelicula con id ${id} Solo puedes borrar peliculas creados por ti.`)
        return
    }

    try{
        let movieBorrado = await movieController.borrarMovie(id)
        console.log(`INFO:Pelicula con id [${id }] fue borrado`)
        res.status(200).json(movieBorrado)
    }catch(err){
        res.status(500).send(`Error ocurrio borrando la pelicula con id [${id}]`)
    }
})


module.exports = moviesRouter