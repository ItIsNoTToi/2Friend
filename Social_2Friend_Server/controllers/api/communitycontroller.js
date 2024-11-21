const community = require("../../models/community/community");
const communitymember = require("../../models/community/communitymember");

exports.createcomunity = async (req,res) => {
  try {
    const {name, description, Isprivate, members} = req.body;

    const creatorId = req.session.userId; 

    const newcommunity = new community.create({ 
      name, description, Isprivate
    });

    const communityMember = await communitymember.create({
      User: creatorId,
      Community: newcommunity._id,
      CommunityMemberType: 'Admin'  // Creator is Admin by default
    });

    const communityMembers = await Promise.all(members.map(async (member) => {
      const newcommunityMember = await communitymember.create({
          User: member.userId,
          Community: newcommunity._id,
          CommunityMemberType: member.role || 'Member'  // Default role is 'Member'
      });
      return newcommunityMember;
    }));

    res.status(201).json({
      message: 'Community created successfully',
      Community: newcommunity,
      creator: communityMember,
      members: communityMembers
    });

  } catch (error) {
    res.status(500).json({ message: error });
  }
};  

exports.getcommunity = async (req, res) => {
  try {
      const userId = req.session.userId;

      // Find the chat member for the current user
      const communityMember = await communitymember.findOne({ User: userId });
      
      if (!communityMember) {
          return res.status(400).json({ message: "No community member found" });
      }

      // Find the chat by the chat ID in chatmember
      const foundcomunity = await community.findById(communityMember.Community);

      if (!foundcomunity) {
          return res.status(400).json({ message: "No community found" });
      }

      // Send success response with chat name
      res.status(200).json({ message: "Success", communityname: foundcomunity.name, communityid: foundcomunity._id });

  } catch (error) {
      res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.getMemberofCommunity = async (req, res) => {
  try {
    const { CommunityId } = req.body;

    // Find all chat members for the given chat ID
    const communityMembers = await communitymember.find({ Community: CommunityId })
      .populate('User', 'username email')  // Populate user details (e.g., username, email)
      .select('User chatmembertype');  // Select the necessary fields

    if (!communityMembers || communityMembers.length === 0) {
      return res.status(404).json({ message: "No members found for this community" });
    }

    res.status(200).json({ 
      message: 'Members retrieved successfully',
      member: communityMembers  
    });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};