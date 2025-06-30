import { Meeting } from '../models/Meeting';

export const getRegistrationEmailTemplate = (meeting: Meeting, registrationLink: string): string => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You're Invited to Join: ${meeting.topic}</h2>
            <p>You have been invited to participate in a chat conference.</p>
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
                <h3>Meeting Details:</h3>
                <p><strong>Topic:</strong> ${meeting.topic}</p>
                <p><strong>Date & Time:</strong> ${new Date(meeting.scheduled_date).toLocaleString()}</p>
            </div>
            <p>Please click the link below to register for this meeting:</p>
            <a href="${registrationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Register Now</a>
            <p>If you cannot click the link, copy and paste this URL into your browser:</p>
            <p>${registrationLink}</p>
        </div>
    `;
};

export const getInviteEmailTemplate = (meeting: Meeting): string => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Meeting Starting Soon: ${meeting.topic}</h2>
            <p>Your registered meeting is about to begin!</p>
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
                <h3>Meeting Details:</h3>
                <p><strong>Topic:</strong> ${meeting.topic}</p>
                <p><strong>Date & Time:</strong> ${new Date(meeting.scheduled_date).toLocaleString()}</p>
            </div>
            <p>Click the link below to join the meeting:</p>
            <a href="${meeting.meeting_link}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Meeting</a>
            <p>Meeting Link: ${meeting.meeting_link}</p>
        </div>
    `;
};

export const getTranscriptEmailTemplate = (meeting: Meeting, transcript: string): string => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Meeting Transcript: ${meeting.topic}</h2>
            <p>Thank you for participating in the meeting. Here's the complete transcript and shared files.</p>
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
                <h3>Meeting Details:</h3>
                <p><strong>Topic:</strong> ${meeting.topic}</p>
                <p><strong>Date & Time:</strong> ${new Date(meeting.scheduled_date).toLocaleString()}</p>
            </div>
            <div style="background-color: #ffffff; border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
                <h3>Chat Transcript:</h3>
                <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${transcript}</pre>
            </div>
            <p>All shared files are attached to this email.</p>
        </div>
    `;
};
