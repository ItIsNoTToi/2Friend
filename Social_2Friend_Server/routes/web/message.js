var express = require('express');
var router = express.Router();
var messagecontroller = require('../../controllers/web/messagecontroller');
var authmiddleware = require('../../middlewares/web/authMiddleware');

router.get('/', authmiddleware, messagecontroller.getMessage);
router.post('/sendmessage', authmiddleware, messagecontroller.sendMessage);
router.post('/messagelike', authmiddleware, messagecontroller.likeMessage);

module.exports = router; 