import { emailTransporter } from '../config/email';
import { Meeting } from '../models/Meeting';
import { getRegistrationEmailTemplate, getInviteEmailTemplate, getTranscriptEmailTemplate } from '../utils/emailTemplates';

export class EmailService {
    static async sendRegistrationEmails(meeting: Meeting, emails: string[]): Promise<void> {
        const registrationLink = `${process.env.FRONTEND_URL}/register-meeting/${meeting.id}`;
        
        for (const email of emails) {
            const mailOptions = {
                from: 'xilfoxy@gmail.com',
                to: email,
                subject: `Registration: ${meeting.topic}`,
                html: getRegistrationEmailTemplate(meeting, registrationLink)
            };
            
            await emailTransporter.sendMail(mailOptions);
        }
    }
    
    static async sendInviteEmails(meeting: Meeting, emails: string[]): Promise<void> {
        for (const email of emails) {
            const mailOptions = {
                from: 'xilfoxy@gmail.com',
                to: email,
                subject: `Meeting Starting Soon: ${meeting.topic}`,
                html: getInviteEmailTemplate(meeting)
            };
            
            await emailTransporter.sendMail(mailOptions);
        }
    }
    
    static async sendTranscriptEmail(email: string, meeting: Meeting, transcript: string, files: any[]): Promise<void> {
        const mailOptions = {
            from: 'xilfoxy@gmail.com',
            to: email,
            subject: `Meeting Transcript: ${meeting.topic}`,
            html: getTranscriptEmailTemplate(meeting, transcript),
            attachments: files.map(file => ({
                filename: file.file_name,
                path: file.file_url
            }))
        };
        
        await emailTransporter.sendMail(mailOptions);
    }
}