import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { supabase } from '../config/database';

export class SocketHandler {
    private io: Server;
    
    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3001",
                methods: ["GET", "POST"]
            }
        });
        
        this.setupMiddleware();
        this.setupHandlers();
    }
    
    private setupMiddleware(): void {
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    throw new Error('No token provided');
                }
                
                const decoded = verifyToken(token);
                (socket as any).userId = decoded.userId;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });
    }
    
    private setupHandlers(): void {
        this.io.on('connection', (socket) => {
            console.log('User connected:', (socket as any).userId);
            
            // Join meeting room
            socket.on('join-meeting', async (meetingId: string) => {
                try {
                    // Verify user is participant
                    const { data: participant } = await supabase
                        .from('participants')
                        .select('*')
                        .eq('meeting_id', meetingId)
                        .eq('user_id', (socket as any).userId)
                        .single();
                    
                    if (participant) {
                        socket.join(meetingId);
                        socket.emit('joined-meeting', { meetingId });
                        
                        // Mark as attended
                        await supabase
                            .from('participants')
                            .update({ 
                                registration_status: 'attended',
                                joined_at: new Date()
                            })
                            .eq('meeting_id', meetingId)
                            .eq('user_id', (socket as any).userId);
                    }
                } catch (error) {
                    socket.emit('error', { message: 'Failed to join meeting' });
                }
            });
            
            // Handle real-time messages
            socket.on('send-message', async (data: { meetingId: string, content: string, messageType?: string }) => {
                try {
                    const { meetingId, content, messageType = 'text' } = data;
                    
                    // Save to database
                    const { data: message, error } = await supabase
                        .from('messages')
                        .insert({
                            meeting_id: meetingId,
                            user_id: (socket as any).userId,
                            content,
                            message_type: messageType
                        })
                        .select('*, users(full_name, email)')
                        .single();
                    
                    if (error) throw error;
                    
                    // Broadcast to all participants in the meeting
                    this.io.to(meetingId).emit('new-message', message);
                } catch (error) {
                    socket.emit('error', { message: 'Failed to send message' });
                }
            });
            
            // Handle typing indicators
            socket.on('typing', (data: { meetingId: string, isTyping: boolean }) => {
                socket.to(data.meetingId).emit('user-typing', {
                    userId: (socket as any).userId,
                    isTyping: data.isTyping
                });
            });
            
            // Handle disconnection
            socket.on('disconnect', async () => {
                console.log('User disconnected:', (socket as any).userId);
                
                // Update participant left time if they were in a meeting
                try {
                    await supabase
                        .from('participants')
                        .update({ left_at: new Date() })
                        .eq('user_id', (socket as any).userId)
                        .is('left_at', null);
                } catch (error) {
                    console.error('Error updating disconnect time:', error);
                }
            });
        });
    }
    
    public getIO(): Server {
        return this.io;
    }
}