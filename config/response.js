const E_SERVER = (err, code = 500 , message2 = 'Estamos teniendo problemas en el servidor, comuniquese con el administrador') => {
    return {
        message :  process.env.DEPLOY === 'produc' ? message2 : err.message,
        code,
        message2
    };
}

const OK_SERVER = (result = [], code = 200, message = 'succes execute') => {
    return {
        message,
        code,
        data: result
    }
}

module.exports = {
    E_SERVER,
    OK_SERVER
}