var express = require('express');
var router = express.Router();
var authMiddleware = require('../../middlewares/api/authMiddleware');
const User = require('../../models/user/users');
const usercontroller = require('../../controllers/api/usercontroller');

// Route for the home page
router.get('/', authMiddleware, (req, res) => {
    try {
        const user = User.findById(req.session.userId);
        res.status(200).json({
            message: 'access congratulation', 
            user: req.session.user, 
            userid: req.session.userId,
            avatar: user.avatar, // Đường dẫn ảnh đại diện
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.get('/find', usercontroller.finduser);


module.exports = router;
