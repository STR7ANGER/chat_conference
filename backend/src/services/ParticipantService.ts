import { supabase } from '../config/database';
import { Participant } from '../models/Participant';

export class ParticipantService {
    static async addParticipants(meetingId: string, emails: string[]): Promise<void> {
        const participants = emails.map(email => ({
            meeting_id: meetingId,
            email,
            registration_status: 'invited' as const
        }));
        
        const { error } = await supabase
            .from('participants')
            .insert(participants);
            
        if (error) throw error;
    }
    
    static async registerParticipant(meetingId: string, email: string): Promise<void> {
        const { error } = await supabase
            .from('participants')
            .update({ registration_status: 'registered' })
            .eq('meeting_id', meetingId)
            .eq('email', email);
            
        if (error) throw error;
    }
    
    static async markAttendance(meetingId: string, userId: string, status: 'attended' | 'not_attended'): Promise<void> {
        const updateData: any = { registration_status: status };
        if (status === 'attended') {
            updateData.joined_at = new Date();
        }
        
        const { error } = await supabase
            .from('participants')
            .update(updateData)
            .eq('meeting_id', meetingId)
            .eq('user_id', userId);
            
        if (error) throw error;
    }
    
    static async getRegisteredParticipants(meetingId: string): Promise<Participant[]> {
        const { data: participants, error } = await supabase
            .from('participants')
            .select('*')
            .eq('meeting_id', meetingId)
            .eq('registration_status', 'registered');
            
        if (error) throw error;
        return participants || [];
    }
}