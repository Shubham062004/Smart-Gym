import transporter from '../config/mailer';

export const generateOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OnlyFitness Password Reset',
        text: `Your OTP code is ${otp}.\n\nThis code will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send email');
    }
};
