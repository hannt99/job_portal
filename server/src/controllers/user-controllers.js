import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Company from '../models/Company.js';
import Category from '../models/Category.js';
import Job from '../models/Job.js';
import JobSave from '../models/JobSave.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';

/**
 * Controller to get all users except the logged-in user
 * */
export const getAllUsersExceptLoggedUserController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        // Find all users except the logged-in user, sorted by creation date descending
        const users = await User.find({ _id: { $ne: loggedInUserId } }).sort({ createdAt: -1 });

        // Respond with success message and the filtered users
        res.status(200).json({ code: 200, message: 'Success', users });
    } catch (err) {
        console.error('Error in getAllUsersExceptLoggedUserController:', err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

/**
 * Controller to get jobs dashboard
 * */
export const getJobChartDataController = async (req, res) => {
    try {
        // Fetch all jobs
        const jobs = await Job.find();
        const yearQuery = Number(req.query.year);

        // Function to get month from timestamp
        const getMonth = (num) => {
            const d = new Date(num);
            return d.getMonth();
        };

        // Function to get year from timestamp
        const getYear = (num) => {
            const d = new Date(num);
            return d.getFullYear();
        };

        // Initialize an array to hold monthly jobs
        const monthlyJobs = Array.from({ length: 12 }, () => []);

        // Group jobs by month
        jobs.forEach((job) => {
            const year = getYear(job.createdAt);
            if (year === yearQuery) {
                const month = getMonth(job.createdAt);
                monthlyJobs[month].push(job);
            }
        });

        // Destructure monthlyJobs array for cleaner response
        const [
            janJobs,
            febJobs,
            marJobs,
            aprJobs,
            mayJobs,
            junJobs,
            julJobs,
            augJobs,
            sepJobs,
            octJobs,
            novJobs,
            decJobs,
        ] = monthlyJobs;

        // Respond with the structured data
        res.status(200).json({
            code: 200,
            message: 'Success',
            jobData: {
                janJobs,
                febJobs,
                marJobs,
                aprJobs,
                mayJobs,
                junJobs,
                julJobs,
                augJobs,
                sepJobs,
                octJobs,
                novJobs,
                decJobs,
            },
        });
    } catch (err) {
        console.error('Error in getJobChartDataController:', err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

/**
 * Controller to get admin dashboard
 * */
export const getAdminDashboardController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        // Count documents for each entity asynchronously
        // Promise.all() takes an array of promises and executes them concurrently
        const [employers, candidates, categories, jobs] = await Promise.all([
            User.countDocuments({ role: 0 }),
            User.countDocuments({ role: 1 }),
            Category.countDocuments(),
            Job.countDocuments(),
        ]);

        // Fetch notifications for the admin user
        const notifications = await Notification.find({ receiverId: loggedInUserId }).sort({ createdAt: -1 });

        // Respond with the dashboard data
        res.status(200).json({
            code: 200,
            message: 'Thành công',
            employers,
            candidates,
            categories,
            jobs,
            notifications,
        });
    } catch (err) {
        console.error('Error in getAdminDashboardController:', err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

/**
 * Controller to get candidate dashboard
 * */
export const getCandidateChartDataController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;
        const yearQuery = Number(req.query.year);

        const getMonth = (num) => {
            const d = new Date(num);
            return d.getMonth();
        };

        const getYear = (num) => {
            const d = new Date(num);
            return d.getFullYear();
        };

        const company = await Company.findOne({ userId: loggedInUserId });

        const allJobs = await Job.find({ companyId: company._id });

        const allApplicants = allJobs.reduce((total, job) => total.concat(job.jobApplicants), []);

        // Initialize an array to hold monthly data
        const monthsData = Array.from({ length: 12 }, () => []);

        // Group applicants by month
        // Organizes allApplicants into an array of arrays (monthsData), where each inner array contains applicants who applied in a specific month of a given year (year)
        // month: 0 -> 11
        allApplicants.forEach((applicant) => {
            if (getYear(applicant.appliedTime) === yearQuery) {
                const month = getMonth(applicant.appliedTime);
                monthsData[month].push(applicant);
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Success',
            data: {
                janApp: monthsData[0],
                febApp: monthsData[1],
                marApp: monthsData[2],
                aprApp: monthsData[3],
                mayApp: monthsData[4],
                junApp: monthsData[5],
                julApp: monthsData[6],
                augApp: monthsData[7],
                sepApp: monthsData[8],
                octApp: monthsData[9],
                novApp: monthsData[10],
                devApp: monthsData[11],
            },
        });
    } catch (err) {
        console.error('Error in getCandidateChartDataController:', err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

/**
 * Controller to get employer dashboard
 * */
export const getEmployerDashboardController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        // Find the company associated with the logged-in user
        const company = await Company.findOne({ userId: loggedInUserId });

        // Get the total jobs associated with the company
        const jobs = await Job.find({ companyId: company._id });
        
        // Calculate the total number of jobs associated with the company
        const jobsCount = await Job.find({ companyId: company._id }).countDocuments();
        // console.log('jobsCount:', jobsCount);

        // Calculate the total number of candidates across all jobs
        // const candidatesCount = await Job.aggregate([
        //     { $match: { companyId: company._id } },
        //     { $project: { totalCandidates: { $sum: { $size: '$jobApplicants' } } } },
        // ]);
        const candidatesCount = jobs?.reduce((total, job) => {
            return total + job?.jobApplicants?.length;
        }, 0);

        // Fetch recommended resumes for jobs that are actively recruiting
        const recommendCVsPromises = jobs
            .filter((j) => j.jobStatus === 'Đang tuyển')
            .map(async (job) => {
                const resumes = await Resume.find({
                    skills: { $in: job.jobSkills },
                    experience: job.jobExp,
                    userId: { $ne: loggedInUserId }, // Exclude current user's resumes
                });
                return resumes;
            });
        const recommendCVs = await Promise.all(recommendCVsPromises);
        const recommendCVsCount = recommendCVs.reduce((total, resumes) => total + resumes.length, 0);

        // Get the total notifications for the logged-in user
        const notis = await Notification.find({ receiverId: loggedInUserId });

        // Respond with the dashboard data
        res.status(200).json({
            code: 200,
            message: 'Success',
            jobsCount,
            candidatesCount,
            recommendCVsCount,
            notis,
        });
    } catch (err) {
        console.error('Error in getEmployerDashboardController:', err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};

/**
 * Controller to change avatar
 * */
export const changeAvatarController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        const file = req.file;
        if (!file) return res.status(400).json({ code: 400, message: 'Hãy chọn 1 ảnh' });

        const fileUrl = process.env.BASE_URL + `/static/${file.filename}`;

        await User.findOneAndUpdate({ _id: loggedInUserId }, { avatar: fileUrl });

        return res.status(200).json({ code: 200, message: 'Thay đổi ảnh nền thành công', fileName: file.filename });
    } catch (err) {
        console.error(`Error in changeAvatarController: ${err}`);
        res.status(500).json({
            code: 500,
            message: 'Unexpected error occurred',
        });
    }
};

/**
 * Controller to change the user's job-seeking status
 * */
export const changeJobSeekingStatusController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        // Extract the job-seeking status from the request body
        const { isJobSeeking } = req.body;

        // Update the user's job-seeking status in the database
        await User.findByIdAndUpdate(loggedInUserId, { isSeeking: isJobSeeking });

        // Send a successful response with an appropriate message
        res.status(200).json({
            code: 200,
            message: !isJobSeeking ? 'Đã tắt tìm việc' : 'Đã bật tìm việc',
        });
    } catch (err) {
        console.error(`Error in changeJobSeekingStatusController: ${err}`);
        res.status(500).json({
            code: 500,
            message: 'Unexpected error occurred',
        });
    }
};

/**
 * Controller to change profile visibility
 * */
export const changeProfileVisibilityController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        const { isProfileVisible } = req.body;

        await User.findByIdAndUpdate(loggedInUserId, { isAppeared: isProfileVisible });

        res.status(200).json({ code: 200, message: !isProfileVisible ? 'Đã ẩn hồ sơ' : 'Hồ sơ đã hiển thị' });
    } catch (err) {
        console.error(`Error in changeProfileVisibilityController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to change user password
 * */
export const changePasswordController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        const userInfo = await User.findById(loggedInUserId);

        // Old password from frontend
        const oldPassword = req.body.oldPassword;
        // Check old password from frontend is the same of password in db
        const isCorrect = await bcrypt.compare(oldPassword, userInfo.password);
        if (!isCorrect) {
            return res.status(400).json({
                code: 400,
                message: 'Mật khẩu cũ không chính xác',
            });
        }

        // New password from frontend
        const newPassword = req.body.newPassword;
        const isConflict = await bcrypt.compare(newPassword, userInfo.password);
        if (isConflict) {
            return res.status(400).json({
                code: 400,
                message: 'Đây là mật khẩu hiện tại của bạn',
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const newPasswordHashed = bcrypt.hashSync(newPassword, salt);

            await User.findByIdAndUpdate({ _id: loggedInUserId }, { password: newPasswordHashed }, { new: true });

            return res.status(200).json({
                code: 200,
                message: 'Thay đổi mật khẩu thành công',
            });
        }
    } catch (err) {
        console.error(`Error in changePasswordController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to update user details
 * */
export const updateUserController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const loggedInUserId = req.user._id;

        await User.findByIdAndUpdate(
            loggedInUserId,
            { $set: req.body },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Cập nhật thành công' });
    } catch (err) {
        console.error(`Error in updateUserController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to delete a user by userId
 * */
export const deleteUserByIdController = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Use Promise.all to delete documents concurrently
        await Promise.all([
            Resume.findOneAndDelete({ userId }),
            JobSave.findOneAndDelete({ userId }),
            Company.findOneAndDelete({ userId }),
            User.findOneAndDelete({ _id: userId }),
        ]);

        res.status(200).json({ code: 200, message: 'Xóa người dùng thành công' });
    } catch (err) {
        console.error('Error in deleteUserByIdController:', err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
};
