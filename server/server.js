import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest,functions} from './inngest/index.js';
import { serve } from "inngest/express";
import {clerkMiddleware} from '@clerk/express';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import aiRouter from './routes/aiRouter.js';

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get('/',(req,res)=>res.send('Server is running'));
app.use('/api/inngest',serve({ client: inngest,functions}));
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
app.use('/api/story',storyRouter);
app.use('/api/message',messageRouter);
app.use("/api/ai", aiRouter);

// Export the app instance for Vercel's serverless environment
export default app;