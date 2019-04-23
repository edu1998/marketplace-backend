const E_SERVER = (err, code = 500, message = 'Estamos teniendo problemas en el servidor, comuniquese con el administrador') => {

    resp = {
        code,
    };

    (process.env.DEPLOY === 'dev') ? resp.messageError = err.message : resp.message = message;

    return resp
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