import { Router } from 'express';
import { ParticipantController } from '../controllers/ParticipantController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register/:meetingId', ParticipantController.registerForMeeting);
router.put('/attendance/:meetingId', authMiddleware, ParticipantController.markAttendance);

export default router;