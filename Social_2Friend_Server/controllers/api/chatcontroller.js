const chat = require('../../models/chat/chat');
const chatmember = require('../../models/chat/chatmember');
const User = require('../../models/user/users');

exports.getAllchat = async (req, res) => {
  try {
      const userId = req.session.userId;

      // Find the chat member for the current user
      const chatMember = await chatmember.findOne({ User: userId });
      
      if (!chatMember) {
          return res.status(400).json({ message: "No chat member found" });
      }

      // Find the chat by the chat ID in chatmember
      const foundChat = await chat.findById(chatMember.Chat);

      if (!foundChat) {
          return res.status(400).json({ message: "No chat found" });
      }
      
      // Send success response with chat name
      res.status(200).json({ message: "Success", chatname: foundChat.name, chatid: foundChat._id, isGroup: foundChat.isGroup});

  } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.getchat = async (req, res) => {
  try {
      const chatId = req.session.chatId;

      // Find the chat by the chat ID in chatmember
      const foundChat = await chat.findById(chatId);

      if (!foundChat) {
          return res.status(400).json({ message: "No chat found" });
      }
      
      // Send success response with chat name
      res.status(200).json({ message: "Success", chatname: foundChat.name, chatid: foundChat._id, isGroup: foundChat.isGroup, chatIcon: foundChat.Chatpicture});

  } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { name, members } = req.body; 
    // members is an array of objects { userId, role }

    const creatorId = req.session.userId; 

    // Create the chat
    const newChat = await chat.create({ name });

    const creatorChatMember = await chatmember.create({
        User: creatorId,
        Chat: newChat._id,
        chatmembertype: 'Admin',
        Isgroup: true,
         // Creator is Admin by default
    });

    // Iterate over each member and create chatmember entries
    const chatMembers = await Promise.all(members.map(async (member) => {
        const newChatMember = await chatmember.create({
            User: member.userId,
            Chat: newChat._id,
            chatmembertype: member.role || 'Member'  // Default role is 'Member'
        });
        return newChatMember;
    }));

    res.status(201).json({
      message: 'Chat created successfully',
      chat: newChat,
      creator: creatorChatMember,
      members: chatMembers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeMemberRole = async (req, res) => {
  try {
    const { chatId, memberId, newRole } = req.body;
    const adminId = req.session.userId;

    // Check if the requester is an Admin
    const adminMember = await chatmember.findOne({
        User: adminId,
        Chat: chatId,
        chatmembertype: 'Admin'
    });

    if (!adminMember) {
        return res.status(403).json({ message: 'Only admins can change member roles.' });
    }

    // Find the chat member whose role needs to be updated
    const memberToUpdate = await chatmember.findOne({
        User: memberId,
        Chat: chatId
    });

    if (!memberToUpdate) {
        return res.status(404).json({ message: 'Member not found in the chat.' });
    }

    // Update the role
    memberToUpdate.chatmembertype = newRole;
    await memberToUpdate.save();

    res.status(200).json({ message: 'Member role updated successfully', member: memberToUpdate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const { chatId } = req.body;

    // Find all chat members for the given chat ID
    const chatMembers = await chatmember.find({ Chat: chatId })
      .populate('User', 'username email')  // Populate user details (e.g., username, email)
      .select('User chatmembertype');  // Select the necessary fields

    if (!chatMembers || chatMembers.length === 0) {
      return res.status(404).json({ message: "No members found for this chat" });
    }

    res.status(200).json({ 
      message: 'Members retrieved successfully',
      members: chatMembers 
    });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};
