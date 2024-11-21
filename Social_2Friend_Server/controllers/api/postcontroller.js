const Post = require('../../models/post/post');
const postlike = require('../../models/post/postlike');
const postmedia = require('../../models/post/postmedia');


exports.getNewPost = async (req,res) => {
  try {
    const userId = req.session.userId;
    const mypost = await Post.findOne({
      Author: userId,
    });
    
    if(!mypost) {
      res.status(400).json({ message: 'No post found'});
    }

    res.status(200).json({ message: 'List your post', post: mypost});
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


exports.getpost = async (req,res) => {
  try {
    const userId = req.session.userId;
    const mypost = await Post.findOne({
      Author: userId,
    });
    
    if(!mypost) {
      res.status(400).json({ message: 'No post found'});
    }

    res.status(200).json({ message: 'List your post', post: mypost});
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.pushpost = async (req,res) => {
  try {
    const userId = req.session.userId;

    const{ content, mediaIds , communityId } = req.body;
    const IsCommunityPost = req.params.IsCommunityPost === 'true';  // Chuyển đổi giá trị từ params

    // Kiểm tra nếu là bài viết vào cộng đồng
    if (IsCommunityPost) {
      if (!communityId) {
        return res.status(400).json({ message: 'Community ID is required for community posts.' });
      }

      const newPost = new Post({
        Author: userId,
        content: content,
        IsCommunityPost: IsCommunityPost,
        Community: communityId // Thêm cộng đồng khi bài là post cộng đồng
      });

      if (mediaIds && mediaIds.length > 0) {
        await Promise.all(mediaIds.map(async (mediaId) => {
          return await postmedia.create({
            Community: communityId,
            media: mediaId,
            Post: newPost._id
          });
        }));
      }
      await newPost.save();
      return res.status(200).json({ message: 'Community post success' });
    }

    // Nếu không phải post cộng đồng
    const newPost = new Post({
      Author: userId,
      content: content,
      IsCommunityPost: IsCommunityPost
    });

    if (mediaIds && mediaIds.length > 0) {
      await Promise.all(mediaIds.map(async (mediaId) => {
        return await postmedia.create({
          media: mediaId,
          Post: newPost._id
        });
      }));
    }

    await newPost.save();
    return res.status(200).json({ message: 'Personal post success' });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.likepost = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { postId } = req.body;
    const existinglikepost = await postlike.findOne({
      post: postId,
      User: userId,  
    })
    if (existinglikepost){
      // chay ham xoa like
      await postlike.Delete(existinglikepost);
    }

    const newlikepost = new postlike({
      post: postId,
      User: userId,      
    });
    await newlikepost.save();

    res.status(200).json({ message: 'like post success'});
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};  
