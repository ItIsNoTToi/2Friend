var express = require('express');
var router = express.Router();
var multer = require('multer');
var profilecontroller = require('../../controllers/api/profilecontroller');

// Cấu hình multer để lưu file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục để lưu file upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
  }
});
var upload = multer({ storage: storage }); // Khởi tạo multer

/* GET profile user. */
router.get('/', profilecontroller.showprofilepages);
router.get('/media/:userId', profilecontroller.getmedia);
router.post('/upload', upload.single('media'), profilecontroller.upload);
router.delete('/media/:mediaId', profilecontroller.deletemedia);

module.exports = router;
