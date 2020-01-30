const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, 'Pelicula debe tener un titulo']
    },
    country:{
        type: String,
        required:[true, 'Pelicula debe tener un lugar donde se realizó']
    },
    language:{
        type: String,
        required:[true, 'Pelicula debe tener un idioma original']
    },
    genre:{
        type: String,
        required:[true, 'Pelicula debe tener un genero']

    },
    year:{
        type: Number,
        min:1920,
        required: [true, 'Producto debe tener un año de creacion']
    },
    dueño:{
        type: String,
        required:[true, 'Producto debe estar asociado a un usuario']
    }
}) 

module.exports = mongoose.model('movie', movieSchema)