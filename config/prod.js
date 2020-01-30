module.exports={
    jwt:{
        secreto:process.env.JWT_SECRET_PROD,
        tiempoDeExpiracion:process.env.JWT_TIME_PROD   
    },
    database:{
        user: process.env.DB_USER_PROD,
        password: process.env.DB_PASSWORD_PROD,
        host: process.env.DB_HOST_PROD,
        name: process.env.DB_NAME_PROD
    }
}