import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { APP_CONFIG } from './config/app';
import { MeetingScheduler } from './jobs/meetingScheduler';
import { SocketHandler } from './socket/socketHandler';

// Routes
import authRoutes from './routes/authRoutes';
import meetingRoutes from './routes/meetingRoutes';
import participantRoutes from './routes/participantRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const socketHandler = new SocketHandler(server);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start scheduler
MeetingScheduler.start();

const PORT = APP_CONFIG.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;