const Movie = require('./movies.model')

function crearMovie(movie, dueño){
    return new Movie({
        ...movie,
        dueño
    }).save()
}

function obtenerMovies(){
    return Movie.find({})
}

function obtenerMovie(id){
    return Movie.findById(id)
}

function borrarMovie(id){
    return Movie.findByIdAndRemove(id)
}

function reemplazarMovie(id, movie, username){
    return Movie.findOneAndUpdate({_id:id},{
        ...movie,
        dueño: username
    },{
        new:true       // nos devuelve la pelicula ya modificado
    })
}

module.exports = {
    crearMovie,
    obtenerMovies,
    obtenerMovie,
    borrarMovie,
    reemplazarMovie
}