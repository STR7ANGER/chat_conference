import { Router } from 'express';
import { MeetingController } from '../controllers/MeetingController';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/authMiddleware';
import { createMeetingSchema } from '../schemas/meetingSchema';

const router = Router();

router.use(authMiddleware);
router.post('/', validateRequest(createMeetingSchema), MeetingController.createMeeting);
router.get('/', MeetingController.getMeetings);
router.get('/:id', MeetingController.getMeeting);

export default router;