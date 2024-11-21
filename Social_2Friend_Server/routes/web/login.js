var express = require('express');
var router = express.Router();
var userController = require('../../controllers/web/usercontroller');

router.get('/', userController.showLoginPage);
router.post('/', userController.handleLogin);


module.exports = router;
