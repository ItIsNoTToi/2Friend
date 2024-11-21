const Media = require('../../models/media/media');
const User = require('../../models/user/users'); // Import mô hình User
const fs = require('fs'); // Import fs để xóa file

exports.showprofilepages = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({
            message: 'Get profile success!',
            user: {
                username: user.username,
                email: user.email,
                avatar: user.avatar, // Đường dẫn ảnh đại diện
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Route tải lên file
exports.upload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const newMedia = new Media({
            filename: req.file.filename,
            filepath: req.file.path,
            owner: req.session.userId, // Giả sử bạn có thông tin người dùng đã đăng nhập
            createdAt: Date.now(),
            MediaType: req.body.mediaType || 'Image', // Loại media có thể là Image, Video, hoặc Audio
        });

        await newMedia.save();
        res.status(200).json({ message: `File uploaded successfully: ${newMedia.filename}`});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
};

exports.getmedia = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userMedia = await Media.find({ owner: userId });

        res.status(200).json({message: 'your profile media', mediaFiles: userMedia });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading profile');
    }
};

exports.deletemedia = async (req, res) => {
    try {
        const mediaId = req.params.mediaId;
        const media = await Media.findById(mediaId);

        if (!media) {
            return res.status(404).send('Media not found');
        }

        // Xóa tệp khỏi hệ thống
        fs.unlinkSync(media.filepath);

        // Xóa thông tin tệp khỏi database
        await Media.findByIdAndDelete(mediaId);

        res.status(200).send('Media deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting media');
    }
};
