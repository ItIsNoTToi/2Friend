const User = require('../../models/user/users');
const Friend = require('../../models/user/userfriends');
const Follow = require('../../models/user/userfollows');
const chat = require('../../models/chat/chat');
const chatmember = require('../../models/chat/chatmember');
const message = require('../../models/message/message');
const { getBaseURL } = require('../../lib/BaseURL');

// danh sách chưa kết bạn bạn bè
exports.friendSuggestions = async (req, res) => {
    try {
        const baseUrl = await getBaseURL(req);
        const userId = req.session.userId;

        // Bước 1: Lấy danh sách bạn bè của userId
        const listFriends = await Friend.find({ $or: [{ User1: userId }, { User2: userId }] });

        // Bước 2: Tạo mảng chứa User2 của các tài liệu trong listFriends
        const excludeIds = listFriends.filter(friend =>
            friend.User1.toString() === userId.toString() ? friend.User2 : friend.User1
        ).map(friend => friend.id);

        // Bước 3: Tìm ngẫu nhiên 20 người trừ những người trong excludeIds
        const otherFriends = await User.aggregate([
            { $match: { _id: { $nin: excludeIds } } }, // loại trừ những người có id trong excludeIds
            { $sample: { size: 20 } }, // giới hạn số lượng
            { $project: { email: 1, username: 1, avatar: { $concat: [baseUrl, '$avatar'] } } } // giá trị trả về
        ]);

        // trả về danh sách chưa kết bạn
        return res.status(200).json(otherFriends);

    } catch (error) {
        console.log('get friend suggettions error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Tìm kiếm bạn bè
exports.findFriend = async (req, res) => {
    try {
        const userId = req.session.userId;
        const keyword = req.params.keyword;

        // Bước 1: Lấy danh sách bạn bè của userId
        const listFriends = await Friend.find({ $or: [{ User1: userId }, { User2: userId }] });

        // Bước 2: Tạo mảng chứa User2 của các tài liệu trong listFriends
        const excludeIds = listFriends.filter(friend =>
            friend.User1.toString() === userId.toString() ? friend.User2 : friend.User1
        ).map(friend => friend.id);

        // Bước 3: Tìm ngẫu nhiên 20 người trừ những người trong excludeIds
        const Friends = await User.aggregate([
            { $match: { _id: { $in: excludeIds } } }, // loại trừ những người có id trong excludeIds
            { $project: { email: 1, username: 1, avatar: 1 } } // giá trị trả về
        ]);

        // tìm kiếm dựa theo tên
        const search = {
            $or: [
                { username: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } }
            ]
        };

        const searchFriend = await Friends.find(search);

        // trả về danh sách chưa kết bạn
        return res.status(200).json(searchFriend);

    } catch (error) {
        console.log('search friend error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// danh sách bạn bè
exports.listfriend = async (req, res) => {
    try {
        const userId = req.session.userId;
        // Find the user by their ID
        const listfriend = await Friend.find({ User1: userId });

        if (!listfriend) {
            return res.status(404).json({ message: 'you have been not friend' });
        }

        // Render trang danh sách bạn bè
        res.status(200).json(listfriend);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// danh sách lời mời kết bạn đã gửi
exports.listrequestfriend = async (req, res) => {
    try {
        const baseUrl = await getBaseURL(req);
        const userId = req.session.userId;
        // Find the user by their ID
        const listrequest = await Follow.find({ Sender: userId });
        if (!listrequest) {
            return res.status(404).json({ message: 'Ban chua gui ket ban voi ai' });
        }
        // tạo mảng chứa danh sách userId lời mời kết bạn đã gửi:
        const excludeIds = listrequest.map(item => item.Accept);
        const requestFriends = await User.aggregate([
            { $match: { _id: { $in: excludeIds } } },
            { $project: { email: 1, username: 1, avatar: { $concat: [baseUrl, '$avatar'] } } }
        ])
        // Render trang danh sách bạn bè
        res.status(200).json(requestFriends);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// danh sách lời mời kết bạn đã nhận
exports.listorderfriend = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log(userId);
        // Find the user by their ID
        const listorder = await Follow.find({
            Accept: userId,
            Status: { $ne: 'Declined', $ne: 'Accepted' }
        });
        console.log(listorder);
        if (!listorder) {
            return res.status(404).json({ message: 'Ban khong co loi moi ket ban nao' });
        }
        const orders = listorder.map(order => order.Sender);
        // Render trang danh sách bạn bè
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// gửi kết bạn
exports.addfriend = async (req, res) => {
    try {
        const senderId = req.session.userId;
        const { receiverId } = req.body;
        console.log(senderId, receiverId);

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send a friend request to yourself' });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        const existingRequest = await Follow.findOne({
            Sender: senderId,
            Accept: receiverId
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const existingOrder = await Follow.findOne({
            Sender: receiverId,
            Accept: senderId
        });

        if (existingOrder) {
            return res.status(400).json({ message: 'Friend Order already exists' });
        }

        const newFriendRequest = new Follow({ Sender: senderId, Accept: receiverId });
        await newFriendRequest.save();

        res.status(200).json({ message: 'requested' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// hủy lời mời kết bạn 
exports.removeAddFriend = async (req, res) => {
    try {
        const senderId = req.session.userId;
        const { receiverId } = req.body;
        console.log(senderId, receiverId);
        if (senderId && receiverId) {
            const existingRequest = await Follow.findOne({
                Sender: senderId,
                Accept: receiverId
            });
            if (!existingRequest) {
                return res.status(400).json({ message: 'No friend requests sent yet' });
            }
            else {
                const isDelete = await Follow.deleteOne(existingRequest);
                if (isDelete) {
                    return res.status(200).json({ message: 'Friend request deleted' });
                }
                else {
                    return res.status(500).json({ message: 'Delete failed friend request' })
                }
            }
        }
    } catch (error) {
        console.log('remove add friend error:', error);
        res.status(500).json({ message: 'Server error' })
    }
}

// chấp nhận lời mời kết bạn
exports.acceptfriend = async (req, res) => {
    try {
        const senderId = req.session.userId;
        const { requestId } = req.body;
        console.log(senderId);

        // Tìm yêu cầu kết bạn
        const friendRequest = await Follow.findOne({
            Sender: requestId,
            Accept: senderId
        });

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found or already processed' });
        }

        // Tìm người gửi và người nhận
        const sender = await User.findById(senderId);
        const receiver = await User.findById(requestId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        const existingRequest = await Friend.findOne({
            User1: senderId,
            User2: requestId
        });
        const existingRequestReversed = await Friend.findOne({
            User2: senderId,
            User1: requestId
        });

        if (existingRequest || existingRequestReversed) {
            return res.status(400).json({ message: 'You have already accepted this request' });
        }

        // Tạo bạn bè mới
        const newFriend = new Friend({ User1: senderId, User2: requestId });
        await newFriend.save();

        friendRequest.Status = 'Accepted';
        await friendRequest.save();

        // Tạo chat mới cho cả hai người
        const newChat = new chat({
            name: `Chat between ${sender.name} and ${receiver.name}`
        });
        await newChat.save();

        // Tạo thành viên chat cho cả hai
        const creatorChatMember1 = await chatmember.create({
            User: senderId,
            Chat: newChat._id,
            chatmembertype: 'Admin'  // Sender là admin
        });
        const creatorChatMember2 = await chatmember.create({
            User: requestId,
            Chat: newChat._id,
            chatmembertype: 'Admin'  // Receiver là admin
        });

        // Trả về model chat với tên người nhận cho người gửi (A)
        res.status(200).json({
            message: 'Friend request accepted successfully',
            chat: {
                chatId: newChat._id,
                name: receiver.name  // Trả về tên của người nhận B
            }
        });

        // Optionally, gửi thông tin này cho phía client của người nhận (B) nếu bạn có socket:
        // socket.to(requestId).emit('newChat', { chatId: newChat._id, name: sender.name });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
// không chấp nhận lời mời kết bạn
exports.declinefriend = async (res, req) => {
    try {
        // Tìm và cập nhật trạng thái yêu cầu kết bạn thành 'Accepted'
        const friendRequest = await Follow.findOneAndUpdate(
            { Sender: requestId, Accept: senderId },
            { Status: 'Declined' }, // Cập nhật trạng thái
            { new: true } // Trả về tài liệu sau khi cập nhật
        );

        if (friendRequest) {
            return res.status(200).json({ message: 'Friend request status updated' })
        } else {
            return res.status(404).json({ message: 'Friend request not found' })
        }
    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

// xóa bạn bè
exports.removeFriend = async (req, res) => {
    try {
        const senderId = req.session.userId;
        const { receiverId } = req.body;

        // Xóa yêu cầu kết bạn từ cơ sở dữ liệu
        await Friend.deleteOne({
            $or: [
                { User1: senderId, User2: receiverId },
                { User1: receiverId, User2: senderId }
            ],
        });

        res.status(200).json({ message: 'Friend removed successfully', redirectUrl: '/user/management' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
