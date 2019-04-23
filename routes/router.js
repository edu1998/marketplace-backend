const express = require('express')
const app = express();

app.use('/registro' ,require('./registro.router'));


module.exports = app;