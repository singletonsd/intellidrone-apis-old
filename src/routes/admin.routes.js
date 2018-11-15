const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');

router.post('/',ctrl.addUser);
router.post('/check',ctrl.getUser);

module.exports = router;
