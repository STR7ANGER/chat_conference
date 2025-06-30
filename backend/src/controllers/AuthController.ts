import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await AuthService.login(req.body);
            res.json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const user = await AuthService.getUserById((req as any).userId);
            res.json({
                success: true,
                data: user
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}