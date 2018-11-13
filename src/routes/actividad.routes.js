const express = require('express');
const router = express.Router();
const act = require('../controllers/actividad.controller');



router.post('/',act.addActividad);
router.get('/',act.getActividades);


module.exports = router;
