const express = require('express');
const router = express.Router();
const empresa = require('../class/empresa.class')
const resgistro = require('../class/registro.class')

const Empresa = new empresa();
const Registro = new resgistro();

router.get('/InfoGeneral/:idEmpresa', async (req, res) => {
    try {
        let result = await Empresa.getInfoGeneral(req.params.idEmpresa);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/InfoGeneral', async (req, res) => {
    try {
        let result = await Empresa.updateInfoGeneral(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/Categorias/:idEmpresa', async (req, res) => {
    try {
        let result = await Empresa.getCategorias(req.params.idEmpresa);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/Categorias', async (req, res) => {
    try {
        Registro.insertCategorias([req.body], req.body.id)
        res.status(200).send({ data: 'succes' });
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/Categorias/:idCategoria', async (req, res) => {
    try {
        const result = await Empresa.deleteCategorias(req.params.idCategoria);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/Servicios/:idEmpresa', async (req, res) => {
    try {
        let result = await Empresa.getServicios(req.params.idEmpresa);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/Servicios', async (req, res) => {
    try {
        Registro.insertServices([req.body], req.body.idEmpresa)
        res.status(200).send({ data: 'succes' });
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/Servicios/:idServicio', async (req, res) => {
    try {
        const result = await Empresa.deleteServicios(req.params.idServicio);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/Empleados/:idEmpresa', async (req, res) => {
    try {
        let result = await Empresa.getEmpleados(req.params.idEmpresa);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/Empleados', async (req, res) => {
    try {
        Registro.inserEmployes([req.body], req.body.idEmpresa)
        res.status(200).send({ data: 'succes' });
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/Empleados/:idEmpleado', async (req, res) => {
    try {
        const result = await Empresa.deleteEmpleado(req.params.idEmpleado);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;