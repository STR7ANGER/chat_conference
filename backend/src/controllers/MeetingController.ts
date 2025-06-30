import { Request, Response } from 'express';
import { MeetingService } from '../services/MeetingService';

export class MeetingController {
    static async createMeeting(req: Request, res: Response): Promise<void> {
        try {
            const meeting = await MeetingService.createMeeting((req as any).userId, req.body);
            res.status(201).json({
                success: true,
                data: meeting
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async getMeetings(req: Request, res: Response): Promise<void> {
        try {
            const meetings = await MeetingService.getUserMeetings((req as any).userId);
            res.json({
                success: true,
                data: meetings
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async getMeeting(req: Request, res: Response): Promise<void> {
        try {
            const meeting = await MeetingService.getMeetingById(req.params.id);
            if (!meeting) {
                res.status(404).json({
                    success: false,
                    message: 'Meeting not found'
                });
                return;
            }
            
            res.json({
                success: true,
                data: meeting
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
