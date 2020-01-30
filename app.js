const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const movieRouter= require('./api/controllers/movies/movies.routes')
const usuariosRouter= require('./api/controllers/usuarios/usuarios.routes')
const authJWT = require('./api/helpers/auth')
const config = require('./config')
const swaggerDoc = require('./swaggerDoc')

const app = express()

//Conección con MongoDB cloud
mongoose.connect(`mongodb+srv://${config.database.user}:${config.database.password}@${config.database.host}/${config.database.name}?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('error', ()=>{
    console.log('Fallo la conexcion a mongodb')
    process.exit(1)
})

passport.use(authJWT)

app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/movies', movieRouter)
app.use('/usuarios', usuariosRouter)
swaggerDoc(app)

app.listen(config.port , () => {
  console.log(`Escuchando en el puerto ${config.port}.`)
})
