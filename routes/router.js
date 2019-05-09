const express = require('express')
const app = express();

app.use('/registro', require('./registro.router'));
app.use('/login', require('./login.router'));
app.use('/empresa', require('./empresa.router'))
app.use('/cliente', require('./cliente.route'))

module.exports = app;