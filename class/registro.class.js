module.exports = class Registro {
    constructor() {
        this.mysql = require('../config/mysql')
        this.mysqlPromise = require('../config/mysql-promise')
        this.response = require('../config/response')
    }

    async getTypePayment() {
        try {
            let typePayment = await this.mysqlPromise.get('SELECT * FROM tipo_empresa');
            return this.response.OK_SERVER(typePayment, 200, 'listado tipo de empresas')
        } catch (error) {
            throw this.response.E_SERVER(error, 500)
        }
    }

    async GuardarEmpresa(data) {
        try {
            await this.mysqlPromise.connect.beginTransaction();

            //insertando informacion de la empresa
            let insertGeneral = await this.inserInfoGeneral(data.infoGeneral);

            console.log(insertGeneral.insertId);

            //insertando las categorias
            await this.insertCategorias(data.registroCategorias, insertGeneral.insertId);

            //insertando servicios
            await this.insertServices(data.registroServicios, insertGeneral.insertId);

            // insertando empleados
            await this.inserEmployes(data.registroEmpleados, insertGeneral.insertId);


            await this.mysqlPromise.connect.commit();

            return this.response.OK_SERVER({}, 200, 'empresa guardad exitosamente')
        } catch (error) {
            await this.mysqlPromise.connect.rollback();
            throw this.response.E_SERVER(error, 500)
        }
    }

    async inserInfoGeneral(infoGeneral) {
        let inserInfo = await this.mysqlPromise.insert(
            'INSERT INTO empresa (nombre, tipo_empresa_id, h_apertura, h_cierre, ubicacion, dias_atencion) VALUES (? , ? ,?, ? , ? ,? )',
            [infoGeneral.nombre, infoGeneral.tipoEmpresa, infoGeneral.horaApertura, infoGeneral.horaCierre, infoGeneral.Ubicacion, JSON.stringify(infoGeneral.diasAtencion)]
        );
        return inserInfo;
    }

    async insertCategorias(categorias, idEmpresa) {
        for (const cat of categorias) {
            const insercat = await this.mysqlPromise.insert(
                'INSERT INTO categorias (codigo, nombre, descripcion, empresa_id) VALUES (? , ? , ? , ?)',
                [cat.codigo, cat.nombre, cat.descripcion, idEmpresa]
            )
            console.log(insercat);
        }
    }

    async insertServices(Servicios, idEmpresa) {
        // buscar categoria a la que pertenece
        for (const ser of Servicios) {
            const idCategory = await this.mysqlPromise.get(
                'SELECT * FROM categorias WHERE codigo = ? AND empresa_id = ? ',
                [ser.cod_categoria, idEmpresa]
            )

            let insertService = await this.mysqlPromise.insert(
                'INSERT INTO servicios (codigo, nombre, precio, duracion_minutos, descripcion, categorias_id) VALUES (?, ?, ?, ?, ?, ?)',
                [ser.codigo, ser.nombre, ser.precio, ser.duracion_minutos, ser.descripcion, idCategory[0].id]
            )

        }
    }

    async inserEmployes(empleados, idEmpresa) {
        for (const emp of empleados) {
            const inserEmpleado = await this.mysqlPromise.insert(
                'INSERT INTO empleados (nombre, apellido, telefono, identificacion, direccion, correo, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [emp.nombre, emp.apellido, emp.telefono, emp.identificacion, emp.direccion, emp.correo, idEmpresa]
            )
            console.log('inser empleado', inserEmpleado.insertId);

            for (const key in emp.servicios) {
                await this.saveEmployesHasServices(idEmpresa, inserEmpleado.insertId, emp.servicios[key]);
            }

        }
    }

    async saveEmployesHasServices(idEmpresa, idEmpleado, CodServicio) {
        const idServices = await this.mysqlPromise.get(
            `SELECT ser.* FROM servicios as ser
            INNER JOIN categorias cat ON cat.id = ser.categorias_id
            WHERE cat.empresa_id = ? AND ser.codigo = ?`,
            [idEmpresa, CodServicio]
        );
        this.mysqlPromise.insert(
            'INSERT INTO empleados_has_servicios (empleados_id, servicios_id) VALUE ( ?, ?)',
            [idEmpleado, idServices[0].id]
        )

    }

}
