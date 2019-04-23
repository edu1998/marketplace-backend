const express = require('express');
const router = express.Router();

const Registro = require('../class/registro.class')

const empresa = new Registro();

router.get('/tipoEmpresa', async (req, res) => {
    try {
        let result = await empresa.getTypePayment();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/guardarEmpresa', async (req, res) => {
    try {
        let result = await empresa.GuardarEmpresa(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;