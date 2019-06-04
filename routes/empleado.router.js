const express = require('express');
const router = express.Router();

const empleado = require('../class/empleado.class')


const Empleado = new empleado();

router.get('/GetEmpleadosPorServicio/:idServicio', async (req, res) => {
    try {
        let result = await Empleado.getEmpleadosPorServicio(req.params.idServicio);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
