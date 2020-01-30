require('dotenv').config()
const ambiente = process.env.NODE_ENV || 'development'

const configuracionBase = {
    jwt:{},
    database:{},
    port:process.env.PORT
}

let configuracionDeAmbiente={}

switch(ambiente){
    case 'desarrollo':
    case 'dev':
    case 'development':
        configuracionDeAmbiente = require('./dev')
        break
    case 'produccion':
    case 'prod':
        configuracionDeAmbiente=require('./prod')
        break
    default:
        configuracionDeAmbiente = require('./dev')
        break 
}

module.exports = {
    ...configuracionBase,
    ...configuracionDeAmbiente
}