import mongoose from "mongoose";

const userScheme= new mongoose.Schema({
    _id:{type:String, required:true},
    email:{type:String, required:true},
    full_name:{type:String, required:true},
    username:{type:String, required:true},
    bio:{type:String, default:'Hey Lets start vibing together'},
    profile_picture:{type:String, default:''},
    cover_photo:{type:String, default:''},
    location:{type:String, default:''},
    followers:{type:String, ref:'user'},
    following:{type:String, ref:'User'},
    connections:{type:String, ref: 'User'},
},{timestamps:true, minimize:false})

const User =mongoose.model('User',userScheme)

export default User