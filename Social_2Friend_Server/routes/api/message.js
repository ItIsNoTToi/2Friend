var express = require('express');
var router = express.Router();
var messagecontroller = require('../../controllers/api/messagecontroller');
var authmiddleware = require('../../middlewares/api/authMiddleware');

router.get('/', authmiddleware, messagecontroller.getMessage);
router.post('/sendmessage', authmiddleware, messagecontroller.sendMessage);
router.post('/messagelike', authmiddleware, messagecontroller.likeMessage);

module.exports = router; 