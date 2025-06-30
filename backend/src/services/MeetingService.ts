import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/database';
import { Meeting, CreateMeetingData } from '../models/Meeting';
import { ParticipantService } from './ParticipantService';
import { EmailService } from './EmailService';

export class MeetingService {
    static async createMeeting(hostId: string, meetingData: CreateMeetingData): Promise<Meeting> {
        const { topic, scheduled_date, participant_emails } = meetingData;
        const meeting_link = `${process.env.BASE_URL}/meeting/${uuidv4()}`;
        
        // Create meeting
        const { data: meeting, error } = await supabase
            .from('meetings')
            .insert({
                host_id: hostId,
                topic,
                scheduled_date,
                meeting_link
            })
            .select()
            .single();
            
        if (error) throw error;
        
        // Add participants
        await ParticipantService.addParticipants(meeting.id, participant_emails);
        
        // Send registration emails
        await EmailService.sendRegistrationEmails(meeting, participant_emails);
        
        return meeting;
    }
    
    static async getMeetingById(meetingId: string): Promise<Meeting | null> {
        const { data: meeting, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('id', meetingId)
            .single();
            
        if (error) return null;
        return meeting;
    }
    
    static async getUserMeetings(userId: string): Promise<Meeting[]> {
        const { data: meetings, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('host_id', userId)
            .order('scheduled_date', { ascending: true });
            
        if (error) throw error;
        return meetings || [];
    }
    
    static async updateMeetingStatus(meetingId: string, status: Meeting['status']): Promise<void> {
        const { error } = await supabase
            .from('meetings')
            .update({ status, updated_at: new Date() })
            .eq('id', meetingId);
            
        if (error) throw error;
    }
}
