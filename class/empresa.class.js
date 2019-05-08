module.exports = class Empresa {

    constructor() {
        this.mysqlPromise = require('../config/mysql-promise');
        this.response = require('../config/response');
    }

    async getInfoGeneral(idEmpresa) {
        try {
            const info = await this.mysqlPromise.getOne(
                `SELECT em.*,tp.nombre tipo_empresa FROM empresa as em
                INNER JOIN tipo_empresa tp ON tp.id=  em.tipo_empresa_id
                where em.id = ?`,
                [idEmpresa])
            return this.response.OK_SERVER(info)
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async updateInfoGeneral(info) {
        try {
            let result = await this.mysqlPromise.update(
                `UPDATE empresa 
                SET nombre=?, h_apertura=?,h_cierre=?,ubicacion=?,dias_atencion=? 
                WHERE id=?`,
                [info.nombre, info.horaApertura, info.horaCierre, info.Ubicacion, JSON.stringify(info.diasAtencion), info.id]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Actuaizados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async getCategorias(idEmpresa) {
        try {
            let result = await this.mysqlPromise.get(
                'SELECT * FROM marketplace.categorias where empresa_id = ?;',
                [idEmpresa]
            )
            return this.response.OK_SERVER(result, 200, 'Datos Actuaizados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async deleteCategorias(idCategoria) {
        try {
            let result = await this.mysqlPromise.querey(
                `DELETE FROM categorias WHERE id= ?`,
                [idCategoria]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Eliminados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async getServicios(idEmpresa) {
        try {
            let result = await this.mysqlPromise.get(
                `SELECT se.*, ca.nombre as nombre_categoria FROM servicios se
                inner join categorias as ca on ca.id = se.categorias_id
                inner join empresa as em on em.id = ca.empresa_id
                where em.id = ?`,
                [idEmpresa]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Actuaizados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async deleteServicios(idServicio) {
        try {
            let result = await this.mysqlPromise.querey(
                `DELETE FROM servicios WHERE id= ?`,
                [idServicio]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Eliminados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async getEmpleados(idEmpresa) {
        try {
            let result = await this.mysqlPromise.get(
                'SELECT * FROM marketplace.empleados where empresa_id = ?',
                [idEmpresa]
            )
            return this.response.OK_SERVER(result, 200, 'Datos Actuaizados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async deleteEmpleado(idEmpleado) {
        try {
            let result = await this.mysqlPromise.querey(
                `DELETE FROM empleados WHERE id= ?`,
                [idEmpleado]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Eliminados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }
}