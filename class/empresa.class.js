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
                `SELECT se.*, ca.nombre as nombre_categoria,ca.codigo as cod_categoria,ca.id as id_categoria FROM servicios se
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
            const result = await this.mysqlPromise.get(
                'SELECT * FROM marketplace.empleados where empresa_id = ?',
                [idEmpresa]
            );
            for (let i = 0; i < result.length; i++) {
                result[i].servicios = await this.mysqlPromise.get(
                    `SELECT es.*,s.codigo FROM empleados_has_servicios es
                    inner join servicios s on es.servicios_id = s.id
                    where es.empleados_id = ?`,
                    [result[i].id]
                )
            }

            return this.response.OK_SERVER(result, 200, 'Datos Actuaizados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async deleteEmpleado(idEmpleado) {
        try {
            await this.mysqlPromise.querey(
                `DELETE FROM empleados_has_servicios WHERE empleados_id=?`,
                [idEmpleado]
            )
            let result = await this.mysqlPromise.querey(
                `DELETE FROM empleados WHERE id= ?`,
                [idEmpleado]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Eliminados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async updateCategoria(categoria) {
        try {
            const result = this.mysqlPromise.querey(
                `UPDATE categorias SET nombre=?, descripcion=? WHERE id= ?`,
                [categoria.nombre, categoria.descripcion, categoria.id]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Eliminados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async updateServicio(servicio) {
        try {

            console.log(servicio.id_categoria);

            const result = await this.mysqlPromise.querey(
                `UPDATE servicios SET nombre=?, precio=?, duracion_minutos=?, descripcion=?, categorias_id=? WHERE id=?`,
                [servicio.nombre, servicio.precio, servicio.duracion_minutos, servicio.descripcion, servicio.id_categoria, servicio.id]
            );
            return this.response.OK_SERVER(result, 200, 'Datos Eliminados')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async updateEmpleado(empleado) {
        try {
            // gestionar empleados has servicios
            await this.mysqlPromise.querey(
                `DELETE FROM empleados_has_servicios WHERE empleados_id=?`,
                [empleado.id]
            );

            for (let i = 0; i < empleado.servicios.length; i++) {
                const idServices = await this.mysqlPromise.get(
                    `SELECT ser.* FROM servicios as ser
                    INNER JOIN categorias cat ON cat.id = ser.categorias_id
                    WHERE cat.empresa_id = ? AND ser.codigo = ?`,
                    [empleado.idEmpresa, empleado.servicios[i]]
                );
                await this.mysqlPromise.insert(
                    `INSERT INTO empleados_has_servicios (empleados_id, servicios_id) VALUES (?, ?);`,
                    [empleado.id, idServices[0].id]
                )
            }


            const result = await this.mysqlPromise.querey(
                `UPDATE empleados SET nombre=?, apellido=?, telefono=?, identificacion=?,direccion=?, correo=? WHERE id=?`,
                [empleado.nombre, empleado.apellido, empleado.telefono, empleado.identificacion, empleado.direccion, empleado.correo, empleado.id]
            );
            return this.response.OK_SERVER(result, 200, 'Empleado actualizado')
        } catch (error) {
            console.log(error);

            throw this.response.E_SERVER(error, 500)
        }
    }
}