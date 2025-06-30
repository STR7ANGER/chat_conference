export interface Message {
    id: string;
    meeting_id: string;
    user_id?: string;
    content: string;
    message_type: 'text' | 'file' | 'image';
    timestamp: Date;
}