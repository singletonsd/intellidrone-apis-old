const express = require('express');
const router = express.Router();
const vacas = require('../controllers/vaca.controller');


router.get('/',vacas.getVacas);
router.get('/:id',vacas.getVacasUser);
router.post('/',vacas.addVaca);
router.get('/:id/:fechaDesde/:fechaHasta',vacas.getVaca);
router.get('/delete/:id',vacas.deleteVaca);

module.exports = router;
