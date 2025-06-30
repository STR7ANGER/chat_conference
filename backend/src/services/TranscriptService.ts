import { supabase } from '../config/database';
import { Message } from '../models/Message';
import { FileShare } from '../models/FileShare';

export class TranscriptService {
    static async generateTranscript(meetingId: string): Promise<{
        messages: Message[];
        files: FileShare[];
        transcript: string;
    }> {
        // Get messages
        const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('*, users(full_name, email)')
            .eq('meeting_id', meetingId)
            .order('timestamp', { ascending: true });
            
        if (msgError) throw msgError;
        
        // Get files
        const { data: files, error: fileError } = await supabase
            .from('file_shares')
            .select('*')
            .eq('meeting_id', meetingId);
            
        if (fileError) throw fileError;
        
        // Generate transcript text
        const transcript = messages?.map(msg => {
            const user = (msg as any).users;
            const userName = user?.full_name || user?.email || 'Unknown User';
            const time = new Date(msg.timestamp).toLocaleTimeString();
            return `[${time}] ${userName}: ${msg.content}`;
        }).join('\n') || '';
        
        return {
            messages: messages || [],
            files: files || [],
            transcript
        };
    }
}