import fs from "fs";
import imagekit from "../configs/imagekit.js";
import User from "../models/user.js";
import { inngest } from "../inngest/index.js";
import Story from "../models/Story.js"; // <-- Add this line

//Add user story
export const addUserStory = async (req, res)=>{
    try{
     const { userId } = req.auth();
     const {content, media_type, background_color}= req.body;
     const media = req.file
     let media_url =''
     //upload media to imagekit
     if(media_type ==='image' || media_type == 'video'){
        const fileBuffer = fs.readFileSync(media.path)
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName: media.originalname,
        })
        media_url = response.url
     }
     // create story
     const story = await Story.create({
        user:userId,
        content,
        media_url,
        media_type,
        background_color
     })
     //schedule story deletion after 24 hrs
     await inngest.send({
        name:'app/story.delete',
        data:{ storyId:story._id}
     })

     res.json({success:true})
    } catch (error){
        console.log(error);
        res.json({success:false, message: error.message});

    }
}
//Get user stories
export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userIds = [
      userId, 
      ...(Array.isArray(user.connections) ? user.connections : []), 
      ...(Array.isArray(user.following) ? user.following : [])
    ].map(id => id.toString()); // convert all IDs to string to match Story.user

    // Fetch stories
    const stories = await Story.find({
      user: { $in: userIds }
    })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
