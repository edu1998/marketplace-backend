const express = require('express');
const router = express.Router();
const cliente = require('../class/cliente.class')

const Cliente = new cliente();

router.get('/InfoPersona/:idPersona', async (req, res) => {
    try {
        let result = await Cliente.getInfoCliente(req.params.idPersona);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/InfoPersona', async (req, res) => {
    try {
        let result = await Cliente.updateInfoCliente(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/GetPersona/:documento', async (req, res) => {
    try {
        let result = await Cliente.getPersona(req.params.documento);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;