import { Request, Response } from 'express';
import { ParticipantService } from '../services/ParticipantService';
import { MeetingService } from '../services/MeetingService';

export class ParticipantController {
    static async registerForMeeting(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            const { email } = req.body;
            
            const meeting = await MeetingService.getMeetingById(meetingId);
            if (!meeting) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting not found'
                });
                return;
            }
            
            await ParticipantService.registerParticipant(meetingId, email);
            
            res.json({
                success: true,
                message: 'Successfully registered for meeting'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async markAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            const { status } = req.body;
            const userId = (req as any).userId;
            
            await ParticipantService.markAttendance(meetingId, userId, status);
            
            res.json({
                success: true,
                message: 'Attendance marked successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
