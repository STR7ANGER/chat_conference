export interface Meeting {
    id: string;
    host_id: string;
    topic: string;
    scheduled_date: Date;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    meeting_link?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMeetingData {
    topic: string;
    scheduled_date: Date;
    participant_emails: string[];
}