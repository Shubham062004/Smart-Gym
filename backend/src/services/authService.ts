import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
};

export const createUser = async (data: any): Promise<IUser> => {
    return User.create({
        name: data.name,
        email: data.email,
        password: data.password, // Mongoose hashes automatically via pre-save hook
        age: data.age,
        height: data.height,
        weight: data.weight,
        fitness_goal: data.goal,
    });
};

export const saveOtp = async (email: string, otpCode: string, expiresInMinutes: number): Promise<IUser | null> => {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    return User.findOneAndUpdate(
        { email },
        { otp_code: otpCode, otp_expires_at: expiresAt },
        { new: true }
    );
};

export const verifyUserOtp = async (email: string, otpCode: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    
    if (!user || user.otp_code !== otpCode || !user.otp_expires_at) {
        return false;
    }
    
    if (new Date() > user.otp_expires_at) {
        return false;
    }
    
    return true;
};

export const resetUserPassword = async (email: string, newPassword: string): Promise<IUser | null> => {
    const user = await User.findOne({ email });
    if (!user) return null;
    
    user.password = newPassword; // Mongoose hashes automatically via pre-save hook
    user.otp_code = undefined;
    user.otp_expires_at = undefined;
    await user.save();
    return user;
};
