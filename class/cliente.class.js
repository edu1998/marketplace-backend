module.exports = class Cliente {

    constructor() {
        this.mysqlPromise = require('../config/mysql-promise');
        this.response = require('../config/response');
    }

    async getInfoCliente(idCliente) {
        try {
            const info = await this.mysqlPromise.getOne(
                `SELECT * FROM clientes where id = ?`,
                [idCliente])
            return this.response.OK_SERVER(info)
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async updateInfoCliente(info) {
        try {
            console.log(info);
            
            let result = await this.mysqlPromise.update(
                `UPDATE clientes SET nombre=?, apellido=?, telefono=?, direccion=?, identificacion=? WHERE id=?`,
                [info.nombre, info.apellidos, info.telefono, info.direccion, info.identificacion, info.id]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Actuaizados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }
}