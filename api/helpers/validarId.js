function validarId(req, res, next){
    let id = req.params.id

    if(id.match(/^[a-fA-F0-9]{24}$/) === null){
        res.status(400).send(`El id [${id}] suministado en el URL no es valido`)
        return
    }
    next()
}

function transformarBodyALowerCase (req, res, next){
    req.body.username && (req.body.username = req.body.username.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

module.exports={
    validarId,
    transformarBodyALowerCase
}