import express from 'express';
import { chatWithRAG } from '../controllers/ragController.js';

const router = express.Router();

router.post('/chat', chatWithRAG);

export default router;
