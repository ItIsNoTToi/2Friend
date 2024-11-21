var express = require('express');
var router = express.Router();
var authMiddleware = require('../../middlewares/web/authMiddleware');
var axios = require('axios');
const User = require('../../models/user/users');
const usercontroller = require('../../controllers/web/usercontroller');


// Route for the home page
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
      
        res.render('index', {
            message: req.session.user.username,
            avatar: user.avatar // Đường dẫn ảnh đại diện
        });
    } catch (error) {
        console.error(error); // In lỗi ra console để theo dõi
        res.status(500).send('Internal Server Error');
    }
});

router.get('/find', usercontroller.finduser);


module.exports = router;
