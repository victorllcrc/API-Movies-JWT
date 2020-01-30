const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
//const routes = require("./api/controllers/movies/movies.routes")

const options={
    swaggerDefinition:{
        info:{
          version: "0.0.1",
          title: "Movies App",
          description: "Apllicaion de peliculas",
          contact: {
            name: "Victor LLancari"
          }
        },
        basePath: "/",
        tags: [ {
            name : "Movies",
            description : "Mantenimiento de las peliculas, protegidas con JWT"
          }, {
            name : "Usuarios",
            description : "Mantenimiento de Usuarios y login"
          },{
            name : "Login",
            description : "Security Login for JWT Generation"
          }
        ],
        schemes : [ "http", "https" ],
        consumes : [ "application/json" ],
        produces : [ "application/json" ],
        securityDefinitions: {
            Bearer : {
              description : "Para acceder a la API, se debe pasar un token JWT válido en todas las consultas en\nel 'Authorization' header.\n\n\nLa API genera un token JWT válido y se devuelve como respuesta de una llamada\na la ruta /login con un usuario y contraseña válidos.\n\n\nLa siguiente sintaxis se debe utilizar en el 'Authorization' header :\n\n    Bearer xxxxxx.yyyyyyy.zzzzzz\n",
              type : "apiKey",
              name : "Authorization",
              in : "header"
            }
          }   
    },
    apis: ["./api/controllers/movies/movies.routes.js","./api/controllers/usuarios/usuarios.routes.js"]
}

const specs = swaggerJsDoc(options)
module.exports = (app)=>{
    app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(specs))
    //app.use('"api-movie', routes)
}