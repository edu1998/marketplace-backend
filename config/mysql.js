require('./environment')
class MySql {

    constructor() {
        this.mysql = require('mysql2');
        this.conexion = this.conectar();
        this.estado();
        this.manejarConeccion();
    }

     manejarConeccion() {
        setInterval(async () => {
            let resul = await this.getOne('select 1 =1');
        }, 1000 * 60 * 60 * 2);
        return true;
    }

    conectar() {
        return this.mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            port: process.env.PORT_MYSQL,
            password: process.env.PASSWORD,
            database: process.env.DB,
        });
    }

    estado() {
        this.conexion.connect(function(err) {
            if (err) {
                console.error(err);
                console.log('[MySql] => \t Error en la conexion');
            } else {
                console.log('[MySql] => \t Conectado');
            }
        });
    }

    get(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            let resultado = null;
            this.conexion.query({
                    sql,
                    values
                },
                (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resultado = result;
                        resolve(resultado);
                    }
                }
            );
        });
    }

    getOne(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            let resultado = null;
            this.conexion.query({
                    sql,
                    values
                },
                (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resultado = result[0];
                        if (Array.isArray(resultado)) {
                            if (resultado.length > 0) {
                                resultado = resultado[0];
                            } else {
                                resultado = null;
                            }
                        }
                        resolve(resultado);
                    }
                }
            );
        });
    }

    procedureOne(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            let resultado = null;
            this.conexion.query({
                    sql,
                    values
                },
                (err, result, fields) => {
                    if (err) {
                        reject(resultado);
                    } else {
                        resultado = result[0];
                        if (Array.isArray(resultado)) {
                            if (resultado.length > 0) {
                                resultado = resultado[0];
                            } else {
                                resultado = null;
                            }
                        }
                        resolve(resultado);
                    }
                }
            );
        });
    }

    procedure(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            let resultado = null;
            this.conexion.query({
                    sql,
                    values
                },
                (err, result, fields) => {
                    if (err) {
                        reject(resultado);
                    } else {
                        resultado = result[0];
                        resolve(resultado);
                    }
                }
            );
        });
    }

    query(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            let resultado = null;
            this.conexion.query({
                sql,
                values
            }, (err, result, fields) => {
                if (err) {
                    reject(resultado);
                } else {
                    resultado = true;
                    resolve(resultado);
                }
            });
        });
    }

    insert(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            this.conexion.query(sql, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    update(sql = '', values = []) {
        return new Promise((resolve, reject) => {
            this.conexion.query(sql, values, (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async describe(tabla, campo) {
        try {
            let opciones = '';
            const i = 6;
            const respuesta = await this.get(`describe ${tabla}`);
            respuesta.forEach(element => {
                if (element.Field === campo) {
                    opciones = element.Type;
                }
            });
            opciones = opciones.slice(0, -2);
            opciones = opciones.substr(i);
            opciones = opciones.split("','");
            return opciones;
        } catch (error) {
            return 'Error';
        }
    }
}
module.exports = new MySql()