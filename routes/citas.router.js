const express = require('express');
const router = express.Router();

const servicio = require('../class/citas.class')

const Servicio = new servicio();

router.get('/CitasAgendadas/:idEmpresa', async (req, res) => {
    try {
        let result = await Servicio.getCitasAgendadas(req.params.idEmpresa);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/GuardarCitas', async (req, res) => {
    try {
        let result = await Servicio.SaveCitas(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/CitasCliente/:idCliente', async (req, res) => {
    try {
        let result = await Servicio.getCitasCliente(req.params.idCliente);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;