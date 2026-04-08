import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const generateToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
