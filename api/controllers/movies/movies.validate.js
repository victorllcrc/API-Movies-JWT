const Joi = require('joi')

const blueprintProducto = Joi.object().keys({
    title:Joi.string().max(100).required(),
    country:Joi.string().max(100).required(),
    language:Joi.string().max(100).required(),
    genre:Joi.string().max(100).required(),
    year:Joi.number().positive().required(),
    
})

module.exports = (req, res, next)=>{
    let resultado = Joi.validate(req.body, blueprintProducto,{
        abortEarly: false,
        convert: false
    })
    console.log(req.body)
    if(resultado.error === null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador, error)=>{
            return acumulador + `[${error.message}]`
        },"")
        console.log(resultado.error.details)
        console.log('La sieguiente pelicula no paso la validacion', req.body, erroresDeValidacion)
        res.status(400).send(`La pelicula en el body debe especificar title, country, language, genre o year. Errores en tu request: ${erroresDeValidacion}`)
    }
}