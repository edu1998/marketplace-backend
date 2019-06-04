module.exports = class Servicio {

    constructor() {
        this.mysqlPromise = require('../config/mysql-promise');
        this.response = require('../config/response');
    }

    async getCitasAgendadas(idEmpresa) {

        let result = await this.mysqlPromise.get(
            `SELECT id,fecha FROM citas WHERE empresa_id = ${idEmpresa};`,
        )
        for (let i = 0; i < result.length; i++) {
            let servicios_has_citas = await this.mysqlPromise.get(
                `SELECT sc.id_servicios_has_citas,
                sc.servicios_id,
                s.duracion_minutos
                FROM servicios_has_citas as sc
                inner join servicios s on s.id = sc.servicios_id
                where sc.citas_id = ?;`,
                [result[i].id]
            )
            result[i].servicios = servicios_has_citas

        }

        return result;
    }

    async SaveCitas(data) {
        try {
            console.log(data);

            await this.mysqlPromise.connect.beginTransaction();

            const result_cita = await this.mysqlPromise.insert(
                `INSERT INTO citas (fecha, clientes_id, empresa_id) VALUES (?,? ,? );`,
                [data.fecha, data.cliente_id, data.id_empresa]
            )
            for (const servicio of data.servicios) {
                this.mysqlPromise.insert(
                    `INSERT INTO servicios_has_citas (servicios_id, citas_id,empleado_id) VALUES (?, ?, ?)`,
                    [servicio.id, result_cita.insertId,servicio.empleado]
                )
            }
            await this.mysqlPromise.connect.commit();
            // await this.mysqlPromise.connect.rollback();
            return this.response.OK_SERVER(data, 200, 'Cita agendada')
        } catch (error) {
            await this.mysqlPromise.connect.rollback();
            throw this.response.E_SERVER(error, 500)
        }
    }

    async getCitasCliente(idCliente) {
        try {
            const result = await this.mysqlPromise.get(
                `select em.nombre nombre_empresa,
                c.fecha fecha_cita,
                em.ubicacion ubicacion_empresa
                from citas c
                inner join empresa em on em.id = c.empresa_id
                WHERE c.clientes_id = ? order by c.fecha`,
                [idCliente]

            )
            return this.response.OK_SERVER(result, 200, 'Lista de citas cliente')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async getCitasEmpresa(idEmpresa) {
        try {
            const result = await this.mysqlPromise.get(
                `select cli.identificacion idenCLiente,
                c.fecha fecha_cita,
                em.ubicacion ubicacion_empresa,
                c.id id_cita
                from citas c
                inner join empresa em on em.id = c.empresa_id
                inner join clientes cli on cli.id = c.clientes_id
                WHERE c.empresa_id = ? order by c.fecha`,
                [idEmpresa]

            )

            for (let i = 0; i < result.length; i++) {
                const infocita = await this.mysqlPromise.get(
                `SELECT sc.servicios_id,sc.citas_id,sc.empleado_id,
                s.nombre nombre_servicio, concat(e.nombre, ' ', e.apellido) nom_empleado
                FROM servicios_has_citas as sc
                inner join servicios s on s.id = sc.servicios_id
                left join empleados e on e.id = sc.empleado_id
                where sc.citas_id = ?`,
                [result[i].id_cita]
                )
                result[i].info_mas = infocita;
            }
            return this.response.OK_SERVER(result, 200, 'Lista de citas cliente')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }
}