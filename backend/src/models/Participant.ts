export interface Participant {
    id: string;
    meeting_id: string;
    email: string;
    user_id?: string;
    registration_status: 'invited' | 'registered' | 'attended' | 'not_attended';
    joined_at?: Date;
    left_at?: Date;
    created_at: Date;
}
