export interface FileShare {
    id: string;
    meeting_id: string;
    user_id?: string;
    file_name: string;
    file_url: string;
    file_type?: string;
    file_size?: number;
    uploaded_at: Date;
}