const express = require('express');
const router = express.Router();
const vacas = require('../controllers/vaca.controller');


router.get('/',vacas.getVacas);
router.post('/',vacas.addVaca);
router.get('/:id/:fechaDesde/:fechaHasta',vacas.getVaca);


module.exports = router;
