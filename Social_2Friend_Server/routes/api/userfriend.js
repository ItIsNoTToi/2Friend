var express = require('express');
var router = express.Router();
var authMiddleware = require('../../middlewares/api/authMiddleware');
var friendController = require('../../controllers/api/friendrequestcontroller');

router.get('/', authMiddleware, friendController.listfriend);
router.get('/FriendSuggestions', authMiddleware, friendController.friendSuggestions);
router.get('/Requestfriend', authMiddleware, friendController.listrequestfriend);
router.get('/Orderfriend', authMiddleware, friendController.listorderfriend);
router.post('/addfriend', authMiddleware, friendController.addfriend);
router.post('/removeAddFriend', authMiddleware, friendController.removeAddFriend)
router.post('/acceptfriend', authMiddleware,friendController.acceptfriend);
router.post('declinefriend', authMiddleware, friendController.declinefriend)
router.post('/removeFriend', authMiddleware, friendController.removeFriend);
router.get('/find/:keyword', authMiddleware, friendController.findFriend);

module.exports = router;
