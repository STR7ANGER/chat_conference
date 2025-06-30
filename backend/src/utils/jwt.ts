import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../config/app';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, APP_CONFIG.JWT_SECRET, {
        expiresIn: APP_CONFIG.JWT_EXPIRY
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, APP_CONFIG.JWT_SECRET);
};
