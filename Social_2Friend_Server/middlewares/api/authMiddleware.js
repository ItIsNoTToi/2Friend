    // middlewares/authMiddleware.js

    module.exports = (req, res, next) => {
        // Kiểm tra nếu đây là kết nối HTTP thông thường
        if (req.session && req.session.user) {
            // Người dùng đã đăng nhập, tiếp tục với request
            return next();
        }

        // Kiểm tra nếu đây là kết nối của Socket.IO
        if (req.request && req.request.session && req.request.session.user) {
            // Nếu kết nối qua WebSocket và đã xác thực session
            return next();
        }

        else {
            return res.status(400).json({ message: 'Please log in to access' });
        }
    };
