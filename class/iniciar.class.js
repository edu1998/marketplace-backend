module.exports = class Iniciar {

    constructor() {
        this.mysqlPromise = require('../config/mysql-promise')
        this.response = require('../config/response')
    }

    async verifiAccount(credentials) {
        try {

            let rolId = credentials.type === 'cliente' ? 2 : 1;
            let inner = credentials.type === 'cliente'
                ? 'inner join clientes as em on u.clientes_id = em.id'
                : 'inner join empresa as em on u.empresa_id = em.id';

            const result = await this.mysqlPromise.get(
                `SELECT u.usuario, u.rol_id, em.nombre nombre, em.id id FROM marketplace.usuario as u
                ${inner}
                where u.usuario = ? 
                and u.contraseña = ?
                and u.rol_id = ?;`,
                [credentials.user, credentials.pass, rolId]
            );


            let verifi = result.length
                ? this.response.OK_SERVER(result, 200, `Bienvenido ${result[0].nombre}`)
                : this.response.OK_SERVER(result, 403, 'Usuario o contraseña incorrectas')

            return verifi
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }
}