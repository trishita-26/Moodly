import User from "../models/user.js";

export const protect = async(req,res,next)=>{
    try {
        const {userId} = await req.auth();
        if (!userId){
          return res.json({success:false , message:"Not authenticated"})
        }
        //console.log(userId)
        const user= await User.findOne({_id:userId})
        req.user=user
        next()
    } catch (error) {
        res.json({success:false , message:error.message})
    }
    
}