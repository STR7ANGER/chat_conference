import cron from 'node-cron';
import { supabase } from '../config/database';
import { EmailService } from '../services/EmailService';
import { ParticipantService } from '../services/ParticipantService';

export class MeetingScheduler {
    static start(): void {
        // Check every minute for meetings starting in 1 minute
        cron.schedule('* * * * *', async () => {
            try {
                const oneMinuteFromNow = new Date(Date.now() + 60000);
                const twoMinutesFromNow = new Date(Date.now() + 120000);
                
                const { data: meetings, error } = await supabase
                    .from('meetings')
                    .select('*')
                    .eq('status', 'scheduled')
                    .gte('scheduled_date', oneMinuteFromNow.toISOString())
                    .lt('scheduled_date', twoMinutesFromNow.toISOString());
                
                if (error) throw error;
                
                for (const meeting of meetings || []) {
                    const participants = await ParticipantService.getRegisteredParticipants(meeting.id);
                    const emails = participants.map(p => p.email);
                    
                    if (emails.length > 0) {
                        await EmailService.sendInviteEmails(meeting, emails);
                    }
                }
            } catch (error) {
                console.error('Error in meeting scheduler:', error);
            }
        });
    }
}