import express from 'express';
import { generateImage } from '../controller/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/generate', generateImage);

export default aiRouter;
