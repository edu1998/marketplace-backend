module.exports = class Empleado {
    constructor() {
        this.mysqlPromise = require('../config/mysql-promise');
        this.response = require('../config/response');
    }

    async getEmpleadosPorServicio(servicio) {
        try {
            console.log(servicio)
            const info = await this.mysqlPromise.get(
                `SELECT empleados.* FROM marketplace.empleados_has_servicios
                inner join empleados on empleados.id = empleados_has_servicios.empleados_id
                where servicios_id = ?
                group by empleados_has_servicios.empleados_id;`,
                [servicio])
            return this.response.OK_SERVER(info)
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }
}