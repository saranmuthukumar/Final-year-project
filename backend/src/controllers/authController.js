import User from '../models/User.js';
import AlumniProfile from '../models/AlumniProfile.js';
import StudentProfile from '../models/StudentProfile.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { ROLES } from '../utils/constants.js';
import { createNotification, notifyRole } from './notificationController.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { email, password, role, profileData } = req.body;

        // Domain validation
        if (!email.endsWith('@jkkn.ac.in')) {
            return res.status(403).json({
                success: false,
                message: 'Registration is restricted to @jkkn.ac.in email addresses only.',
            });
        }

        // Validate role
        if (!Object.values(ROLES).includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role',
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role,
            isVerified: role === ROLES.ADMIN || role === ROLES.COORDINATOR ? true : false,
        });

        // Create profile based on role
        if (role === ROLES.ALUMNI && profileData) {
            await AlumniProfile.create({
                userId: user._id,
                ...profileData,
                isApproved: false,
            });
        } else if (role === ROLES.STUDENT && profileData) {
            await StudentProfile.create({
                userId: user._id,
                ...profileData,
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        // Store refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Notify admins about new registration
        notifyRole('Admin', 'New User Registration! 👤',
            `A new ${role} (${email}) has registered and is pending approval.`,
            'registration'
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Contact admin.',
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        // Store refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Notify user about successful login
        await createNotification(
            user._id,
            'Welcome Back! 👋',
            `You logged in successfully at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.`,
            'system'
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required',
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.userId).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id, user.role);

        // Update refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        // Clear refresh token
        req.user.refreshToken = null;
        await req.user.save();

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        let profile = null;

        if (req.user.role === ROLES.ALUMNI) {
            profile = await AlumniProfile.findOne({ userId: req.user._id });
        } else if (req.user.role === ROLES.STUDENT) {
            profile = await StudentProfile.findOne({ userId: req.user._id });
        }

        res.json({
            success: true,
            data: {
                user: req.user,
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'There is no user with that email',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Since no email provider is configured, log it to console
        console.log('======================================================');
        console.log('PASSWORD RESET LINK GENERATED');
        console.log(`User: ${email}`);
        console.log(`Reset Token: ${resetToken}`);
        console.log('Use this token in the frontend to reset the password.');
        console.log('======================================================');

        res.status(200).json({
            success: true,
            message: 'Password reset token generated (Check server console)',
            data: { resetToken } // Providing token to frontend temporarily for development ease
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Notify user about password change
        await createNotification(
            user._id,
            'Security Alert 🔒',
            `Your password was successfully reset at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.`,
            'system'
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        next(error);
    }
};
