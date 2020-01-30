module.exports={
    jwt:{
        secreto:process.env.JWT_SECRET_DEV,
        tiempoDeExpiracion:process.env.JWT_TIME_DEV    
    },
    database:{
        user: process.env.DB_USER_DEV,
        password: process.env.DB_PASSWORD_DEV,
        host: process.env.DB_HOST_DEV,
        name: process.env.DB_NAME_DEV
    }
}