var express = require('express');
var router = express.Router();
var userController = require('../../controllers/web/usercontroller');


router.get('/', userController.showRegisterPage);
router.post('/', userController.handleRegister);

module.exports = router;
