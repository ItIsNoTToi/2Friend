var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var authMiddleware = require('../../middlewares/api/authMiddleware');
var userController = require('../../controllers/api/usercontroller');
var User = require('../../models/user/users');

// GET manager page
router.get('/', authMiddleware, userController.currentUser);

// POST route (xử lý khi thêm mới người dùng)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            phone,
            password: hashedPassword
        });
        
        await newUser.save();
        const users = await User.find();
        res.status(200).json({ 
            message: 'add new user success', 
            users: users
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route để xóa người dùng
router.post('/delete-user/:id', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'delete'+ req.params.id + 'success'});
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route để cập nhật role người dùng
router.post('/update-user/:id', authMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { role: role });
        res.status(200).json({message: 'update role of'+ req.params.id + 'success'});
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Route lấy thông tin người dùng(email, username, avatar)
router.get('/people/:userId', authMiddleware, userController.getUser)

module.exports = router;
