import jwt from 'jsonwebtoken';

// Generate verify email token
export const generateVerifyEmailToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.VERIFY_EMAIL_SECRET, {
        expiresIn: '1d',
    });
};

// Generate access token
export const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, process.env.ACCESS_SECRET, {
        expiresIn: '1d',
    });
};

// Generate reset password token
export const generateResetPasswordToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, process.env.RESET_PASS_SECRET, {
        expiresIn: '600s',
    });
};
