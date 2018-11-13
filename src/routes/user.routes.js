const express = require('express');
const router = express.Router();
const usr = require('../controllers/user.controller');



router.post('/',usr.addUser);
router.post('/check',usr.getUser);
router.post('/setCoordinates',usr.setCoordinates);

module.exports = router;
