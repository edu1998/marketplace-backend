const mysql = require('mysql2/promise');
require('./environment')

class MysqlPromise {
    constructor() {
        this.connect = null
        this.connection();
    }

    async connection() {
        try {
            this.connect = await mysql.createConnection({
                host: process.env.HOST,
                user: process.env.USER,
                port: process.env.PORT_MYSQL,
                password: process.env.PASSWORD,
                database: process.env.DB,
            });
            console.log("[MySql-Promise] ===> Conection Succes");
        } catch (error) {
            console.log("[MySql-Promise] ===> Conection Error");
        }
    }

    async get(sql = '', values = []) {
        try {
            const [rows] = await this.connect.execute(sql, values);
            return rows
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getOne(sql = '', value = []) {
        try {
            const [rows] = await this.connect.execute(sql, value);
            return rows[0]
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async insert(sql = '', values = []) {
        try {
            const [rows] = await this.connect.execute(sql, values);
            return rows
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async update(sql = '', values = []) {
        try {
            const [rows] = await this.connect.execute(sql, values);
            return rows
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async querey(sql = '', values = []) {
        try {
            const [rows] = await this.connect.execute(sql, values);
            return rows
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}

module.exports = new MysqlPromise();