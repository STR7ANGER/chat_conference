import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { TranscriptService } from '../services/TranscriptService';
import { EmailService } from '../services/EmailService';
import { MeetingService } from '../services/MeetingService';
import { ParticipantService } from '../services/ParticipantService';

export class ChatController {
    static async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { meeting_id, content, message_type = 'text' } = req.body;
            const userId = (req as any).userId;
            
            // Save message to database
            const { data: message, error } = await supabase
                .from('messages')
                .insert({
                    meeting_id,
                    user_id: userId,
                    content,
                    message_type
                })
                .select()
                .single();
                
            if (error) throw error;
            
            res.status(201).json({
                success: true,
                data: message
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            
            const { data: messages, error } = await supabase
                .from('messages')
                .select('*, users(full_name, email)')
                .eq('meeting_id', meetingId)
                .order('timestamp', { ascending: true });
                
            if (error) throw error;
            
            res.json({
                success: true,
                data: messages
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            const userId = (req as any).userId;
            const file = req.file;
            
            if (!file) {
                res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
                return;
            }
            
            // Upload file to Supabase Storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('meeting-files')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });
                
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from('meeting-files')
                .getPublicUrl(fileName);
            
            // Save file info to database
            const { data: fileShare, error } = await supabase
                .from('file_shares')
                .insert({
                    meeting_id: meetingId,
                    user_id: userId,
                    file_name: file.originalname,
                    file_url: urlData.publicUrl,
                    file_type: file.mimetype,
                    file_size: file.size
                })
                .select()
                .single();
                
            if (error) throw error;
            
            res.status(201).json({
                success: true,
                data: fileShare
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async closeMeeting(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            const userId = (req as any).userId;
            
            // Verify user is the host
            const meeting = await MeetingService.getMeetingById(meetingId);
            if (!meeting || meeting.host_id !== userId) {
                res.status(403).json({
                    success: false,
                    message: 'Only the host can close the meeting'
                });
                return;
            }
            
            // Update meeting status
            await MeetingService.updateMeetingStatus(meetingId, 'completed');
            
            // Generate transcript
            const { transcript, files } = await TranscriptService.generateTranscript(meetingId);
            
            // Get all participants who attended
            const { data: participants, error } = await supabase
                .from('participants')
                .select('email')
                .eq('meeting_id', meetingId)
                .eq('registration_status', 'attended');
                
            if (error) throw error;
            
            // Send transcript emails to all participants
            const emails = participants?.map(p => p.email) || [];
            for (const email of emails) {
                await EmailService.sendTranscriptEmail(email, meeting, transcript, files);
            }
            
            res.json({
                success: true,
                message: 'Meeting closed and transcripts sent to all participants'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}