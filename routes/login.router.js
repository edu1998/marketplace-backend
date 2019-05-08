const express = require('express');
const router = express.Router();

const Inicio = require('../class/iniciar.class')

const inicio = new Inicio()

router.post('', async (req, res) => {
    try {
        const result = await inicio.verifiAccount(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send(error)
    }

});

module.exports = router;