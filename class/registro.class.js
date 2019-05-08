module.exports = class Registro {
    constructor() {
        this.mysqlPromise = require('../config/mysql-promise')
        this.response = require('../config/response')
    }

    async getTypePayment() {
        try {
            let typePayment = await this.mysqlPromise.get('SELECT * FROM tipo_empresa');
            return this.response.OK_SERVER(typePayment, 200, 'listado tipo de empresas')
        } catch (error) {
            console.log(error);

            throw this.response.E_SERVER(error, 500)
        }
    }

    async GuardarEmpresa(data) {
        try {
            if (await this.validUserEnterprice(data.infoInicio.correo)) {
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

                const result = await this.saveUserEnterprice(data.infoInicio, insertGeneral.insertId);

                await this.mysqlPromise.connect.commit();
                
                return this.response.OK_SERVER({}, 200, result)
            }else {
                return this.response.OK_SERVER({}, 200, 'Su correo ya se encuentra registrado')
            }

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

    async saveUserEnterprice(info, id_empresa) {
        await this.mysqlPromise.insert(

            `INSERT INTO usuario (usuario, contraseña, rol_id, empresa_id) VALUES (?, ?, ?, ?)`,
            [info.correo, info.contraseña, 1, id_empresa]
        )
        return 'Su empresa ha sido registrada con exito'
    }

    async validUserEnterprice(correo) {
        const result = await this.mysqlPromise.getOne(
            `SELECT count(*) as count FROM marketplace.usuario WHERE empresa_id is not null and usuario = binary ?`,
            [correo]
        );

        let count = true;

        if (parseInt(result.count) > 0) {
            count = null;
        }

        return count

    }

    async GuardarCliente(data) {
        try {
            await this.mysqlPromise.connect.beginTransaction();
            console.log(data);

            if (await this.validUserClient(data.correo)) {

                const idCliente = await this.mysqlPromise.insert(
                    `INSERT INTO clientes (nombre, apellido, telefono, direccion, correo, identificacion) VALUES (?, ?, ?, ?, ?, ?)`,
                    [data.nombre, data.apellidos, data.telefono, data.direccion, data.correo, data.identificacion]
                )

                let result = await this.saveUserClient(data, idCliente.insertId);

                await this.mysqlPromise.connect.commit();

                return this.response.OK_SERVER(data, 200, result)
            } else {
                await this.mysqlPromise.connect.rollback();
                return this.response.OK_SERVER(data, 200, 'Su correo ya se encuentra registrado')
            }

        } catch (error) {
            await this.mysqlPromise.connect.rollback();
            throw this.response.E_SERVER(error, 500)
        }
    }

    async validUserClient(correo) {
        const result = await this.mysqlPromise.getOne(
            `SELECT count(*) as count FROM marketplace.usuario WHERE clientes_id is not null and usuario = binary ?`,
            [correo]
        );

        let count = true;

        if (parseInt(result.count) > 0) {
            count = null;
        }

        return count

    }

    async saveUserClient(info, id_cliente) {
        if (await this.validUserEnterprice(info.correo)) {
            await this.mysqlPromise.insert(

                `INSERT INTO usuario (usuario, contraseña, rol_id, clientes_id) VALUES (?, ?, ?, ?)`,
                [info.correo, info.contraseña, 2, id_cliente]
            )
            return 'Su Cliente ha sido registrada con exito'
        }
    }

}