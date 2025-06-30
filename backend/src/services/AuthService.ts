import bcrypt from 'bcrypt';
import { supabase } from '../config/database';
import { User, CreateUserData, LoginUserData } from '../models/User';
import { generateToken } from '../utils/jwt';

export class AuthService {
    static async register(userData: CreateUserData): Promise<{ user: Partial<User>, token: string }> {
        const { email, password, full_name } = userData;
        
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
            
        if (existingUser) {
            throw new Error('User already exists');
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert({ email, password_hash, full_name })
            .select('id, email, full_name, created_at')
            .single();
            
        if (error) throw error;
        
        const token = generateToken(user.id);
        
        return { user, token };
    }
    
    static async login(loginData: LoginUserData): Promise<{ user: Partial<User>, token: string }> {
        const { email, password } = loginData;
        
        // Get user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (error || !user) {
            throw new Error('Invalid credentials');
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        
        const token = generateToken(user.id);
        
        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                created_at: user.created_at
            },
            token
        };
    }
    
    static async getUserById(userId: string): Promise<Partial<User> | null> {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, full_name, created_at')
            .eq('id', userId)
            .single();
            
        if (error) return null;
        return user;
    }
}
