import transporter from '../config/mailer';

export const generateOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@smartgym.com',
        to: email,
        subject: 'AstraFit Password Reset',
        text: `Your OTP code is ${otp}.\n\nThis code will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error('--- DEVELOPMENT OTP FALLBACK ---');
        console.error(`To: ${email}`);
        console.error(`OTP Code: ${otp}`);
        console.error('Reason for email failure:', (error as any).message);
        console.error('--------------------------------');
        
        // In development, we don't want to crash the request just because email failed
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Could not send email');
        }
    }
};
