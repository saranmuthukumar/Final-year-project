import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// @desc    Get pending student approvals (Admin only)
// @route   GET /api/students/pending
// @access  Private (Admin)
export const getPendingStudents = async (req, res, next) => {
    try {
        const pendingStudents = await StudentProfile.find({ isApproved: false })
            .populate('userId', 'email createdAt')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: pendingStudents,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all approved students (for alumni directory)
// @route   GET /api/students
// @access  Private (Alumni, Admin)
export const getAllStudents = async (req, res, next) => {
    try {
        const students = await StudentProfile.find({ isApproved: true })
            .populate('userId', 'email')
            .sort({ createdAt: -1 });

        // Map to return a flattened structure similar to Alumni
        const formattedStudents = students.map(student => ({
            _id: student.userId._id, // use userId because frontend messaging relies on user ID
            profileId: student._id,
            name: student.name,
            rollNumber: student.rollNumber,
            department: student.department,
            batch: student.batch,
            interests: student.interests,
            bio: student.bio,
            profileImage: student.profileImage,
            email: student.userId ? student.userId.email : '',
        }));

        res.json({
            success: true,
            count: formattedStudents.length,
            data: {
                students: formattedStudents
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student interests analytics (Admin only)
// @route   GET /api/students/analytics
// @access  Private (Admin)
export const getStudentAnalytics = async (req, res, next) => {
    try {
        const students = await StudentProfile.find({ isApproved: true });

        // Aggregate interests
        const interestMap = {};
        students.forEach(student => {
            if (student.interests && Array.isArray(student.interests)) {
                student.interests.forEach(interest => {
                    const normalizedInterest = interest.trim().toLowerCase();
                    if (normalizedInterest) {
                        interestMap[normalizedInterest] = (interestMap[normalizedInterest] || 0) + 1;
                    }
                });
            }
        });

        // Convert to array and sort by frequency (desc)
        const interestAnalytics = Object.keys(interestMap)
            .map(key => ({ interest: key, count: interestMap[key] }))
            .sort((a, b) => b.count - a.count);

        res.json({
            success: true,
            data: interestAnalytics,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve student profile (Admin only)
// @route   PUT /api/students/:id/approve
// @access  Private (Admin)
export const approveStudent = async (req, res, next) => {
    try {
        const student = await StudentProfile.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found',
            });
        }

        student.isApproved = true;
        await student.save();

        // Update user verification
        await User.findByIdAndUpdate(student.userId, { isVerified: true });

        // Notify the student
        await createNotification(
            student.userId,
            'Account Approved! 🎉',
            'Your student account has been approved. You now have full access to the platform.',
            'approval'
        );

        res.json({
            success: true,
            message: 'Student profile approved successfully',
            data: student,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject student profile (Admin only)
// @route   PUT /api/students/:id/reject
// @access  Private (Admin)
export const rejectStudent = async (req, res, next) => {
    try {
        const student = await StudentProfile.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found',
            });
        }

        res.json({
            success: true,
            message: 'Student profile rejected and removed',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update own student profile
// @route   PUT /api/students/profile
// @access  Private (Student - own profile)
export const updateStudentProfile = async (req, res, next) => {
    try {
        const student = await StudentProfile.findOne({ userId: req.user._id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found',
            });
        }

        const allowedFields = ['name', 'department', 'batch', 'interests', 'bio', 'profileImage'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                student[field] = req.body[field];
            }
        });

        await student.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: student,
        });
    } catch (error) {
        next(error);
    }
};
