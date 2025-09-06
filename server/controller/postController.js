import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Post from "../models/Post.js";
import User from "../models/user.js";

// Add Post
export const addPost = async (req, res) => {
  try {
    // Agar tumhare JWT middleware object return karta hai, to req.auth.userId use karo
    const userId = req.auth.userId || req.auth().userId;

    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];

    if (images && images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);

          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
          });

          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });

          return url;
        })
      );
    }

    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });

    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.auth.userId || req.auth().userId;
    const user = await User.findById(userId);

    // user connections and followings
    const userIds = [
      userId,
      ...(user.connections || []),
      ...(user.following || []),
    ];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Like/Unlike Post
export const likePost = async (req, res) => {
  try {
    const userId = req.auth.userId || req.auth().userId;
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes_count.some(
      (u) => u.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes_count = post.likes_count.filter(
        (u) => u.toString() !== userId.toString()
      );
      await post.save();
      res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes_count.push(userId);
      await post.save();
      res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
