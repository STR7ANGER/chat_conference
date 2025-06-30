import { Router } from 'express';
import multer from 'multer';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validation';
import { messageSchema } from '../schemas/messageSchema';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);
router.post('/message', validateRequest(messageSchema), ChatController.sendMessage);
router.get('/messages/:meetingId', ChatController.getMessages);
router.post('/upload/:meetingId', upload.single('file'), ChatController.uploadFile);
router.post('/close/:meetingId', ChatController.closeMeeting);

export default router;