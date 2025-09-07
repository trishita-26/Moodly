import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Post from "../models/Post.js";
import User from "../models/user.js";

// Add Post
export const addPost = async (req, res) => {
  try {
    const { text } = req.body;
    const uploadedImages = [];

    // Check if files were uploaded (req.files will be an array)
    if (req.files && req.files.length > 0) {
      
      // Create an array of upload promises
      const uploadPromises = req.files.map(file => 
        imagekit.upload({
          file: file.buffer, // Use .buffer, NOT .path
          fileName: file.originalname,
          folder: "/posts" // Optional: A folder in ImageKit
        })
      );
      
      // Wait for all files to finish uploading
      const uploadResults = await Promise.all(uploadPromises);
      
      // Get the URLs and fileIds from the results
      uploadResults.forEach(result => {
        uploadedImages.push({
          url: result.url,
          fileId: result.fileId
        });
      });
    }
   console.log(req.user)
    // Create new post with the text and image URLs
    const newPost = new Post({
      user: req.user._id, // From your 'protect' middleware
      text: text,
      images: uploadedImages,
      post_type: req.body.post_type
    });

    await newPost.save();

    res.status(201).json({ success: true, message: "Post created successfully", post: newPost });

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Server error while creating post" });
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
