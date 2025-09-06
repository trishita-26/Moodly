import express from 'express';
import { acceptConnectionRequest, discoverUsers, followUsers, getUserConnections, getUserData, getUserProfiles, sendConnectionRequest, unfollowUsers, updateUserData } from '../controller/userController.js';
import { protect } from '../middlewares/auth.js'
import { upload} from '../configs/multer.js'
import { getUserRecentMessages } from '../controller/messageController.js';

const userRouter = express.Router();

userRouter.get('/data', protect, getUserData)
userRouter.post('/update', upload.fields([{name:'profile', maxCount:1},{name:'cover', maxCount:1} ]), protect, updateUserData)
userRouter.post('/discover', protect, discoverUsers)
userRouter.post('/follow', protect, followUsers)
userRouter.post('/unfollow', protect, unfollowUsers)
userRouter.post('/connect', protect, sendConnectionRequest)
userRouter.post('/accept', protect, acceptConnectionRequest)
userRouter.get('/connections', protect, getUserConnections)
userRouter.post('/profiles',getUserProfiles)
userRouter.get('/recent-message', protect, getUserRecentMessages)


export default userRouter

