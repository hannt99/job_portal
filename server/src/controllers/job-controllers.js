import Resume from '../models/Resume.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import JobSave from '../models/JobSave.js';
import Notification from '../models/Notification.js';
import schedule from 'node-schedule';
import setSlug from '../utils/slugify.js';
import { checkDatetime } from '../utils/checkDateTime.js';
import { updateCategoryByIdController } from './category-controllers.js';

/**
 * Controller to create a job
 * */
export const createJobController = async (req, res) => {
    try {
        // Find the company based on the logged-in user's ID
        const userId = req.user._id;
        // console.log("userId: ", userId)

        const company = await Company.findOne({ userId: userId });
        // console.log("companyId: ", company._id)

        // Create a new job with companyId set to the company's ID
        const newJob = new Job({ ...req.body, companyId: company._id });
        await newJob.save();

        // Schedule a job to update jobStatus when jobDeadline is reached
        schedule.scheduleJob(newJob?.jobDeadline, async () => {
            await Job.findOneAndUpdate({ _id: newJob._id }, { jobStatus: 'Hết hạn nộp' });
        });

        // Create notifications for all followers of the company
        await Promise.all(
            company?.followers?.map(async (fl) => {
                const newNotification = new Notification({
                    notification: `${company?.companyName} vừa tạo việc làm mới`,
                    receiverId: fl,
                    link: `${process.env.REACT_APP_BASE_URL}/company/${setSlug(company?.companyName)}?requestId=${
                        company?._id
                    }`,
                    isRead: false,
                });
                await newNotification.save();
            }),
        );

        // Respond with success message and data
        res.status(200).json({
            code: 200,
            message: 'Việc mới đã được tạo thành công',
            data: newJob,
            receiverIds: company?.followers,
        });
    } catch (err) {
        console.error(`createJobController error: ${err}`);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get job details by jobId
 * */
export const getJobController = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Find the job by jobId and populate the companyId field
        const job = await Job.findById(jobId).populate('companyId');

        // Respond with success message the job details
        res.status(200).json({ code: 200, message: 'Success', job });
    } catch (err) {
        console.error('getJobController error:', err);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get all jobs by specific employer
 * */
export const getAllJobByEmployerController = async (req, res) => {
    try {
        // Destructure query parameters
        let { limit, page, search } = req.query;
        // Default values for limit and page if not provided
        if (!limit) limit = 5;
        if (!page) page = 1;
        // Prepare query filters based on search parameter
        let queryFilters = {};
        if (search) {
            queryFilters = { jobTitle: { $regex: search, $options: 'i' } };
        }

        // Calculate pagination skip
        const skip = (page - 1) * limit;

        // Find the company based on the logged-in user's ID
        const company = await Company.findOne({ userId: req.user._id });

        // Query jobs with populated company info, sorted by createdAt
        const jobs = await Job.find({ ...queryFilters, companyId: company._id })
            .populate('companyId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total jobs matching query
        const totalJobs = await Job.countDocuments({ ...queryFilters, companyId: company._id });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalJobs / limit);

        // Respond with success message and data
        res.status(200).json({ code: 200, message: 'Thành công', jobs, totalPages });
    } catch (error) {
        console.error('getAllJobByEmployerController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get active jobs by employer
 * */
export const getActiveJobByEmployerController = async (req, res) => {
    try {
        // Find the company based on the logged-in user's ID
        const userId = req.user._id;

        const company = await Company.findOne({ userId: userId });

        // Query active jobs for the company
        const activeJobs = await Job.find({ companyId: company._id, jobStatus: 'Đang tuyển' })
            .select('_id jobTitle')
            .sort({ createdAt: -1 });

        // Respond with success message active jobs data
        res.status(200).json({ code: 200, message: 'Thành công', activeJobs });
    } catch (error) {
        console.error('getActiveJobByEmployerController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get applicants by job
 * */
export const getApplicantsByJob = async (req, res) => {
    try {
        // Find the job based on jobId from query parameters, and populate jobApplicants
        const { jobId } = req.query;

        const job = await Job.findOne({ _id: jobId }).populate('jobApplicants.userId', '-password -role');

        // Extract applicants from job, if job exists
        const applicants = job?.jobApplicants;

        // Respond with success message and applicants data
        res.status(200).json({ code: 200, message: 'Success', applicants });
    } catch (error) {
        console.error('getApplicantsByJob error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get all jobs (for candidates)
 * */
export const getAllJobController = async (req, res) => {
    try {
        // Destructure query parameters
        let {
            jobId,
            search,
            jobCareers,
            jobExp,
            jobSalaryRange,
            jobType,
            jobWorkingLocation,
            jobStatus,
            companyId,
            sort,
            limit,
            page,
        } = req.query;

        // Prepare query filters based on search parameter
        let queryFilters = {};

        if (jobId) {
            queryFilters.jobId = jobId;
        }

        if (search) {
            queryFilters = { jobTitle: { $regex: search, $options: 'i' } };
        }

        if (jobCareers) {
            queryFilters.jobCareers = jobCareers;
        }

        if (jobExp) {
            queryFilters.jobExp = jobExp;
        }

        if (jobSalaryRange) {
            queryFilters.jobSalaryRange = jobSalaryRange;
        }

        if (jobType) {
            queryFilters.jobType = jobType;
        }

        if (jobWorkingLocation) {
            queryFilters.jobWorkingLocation = { $elemMatch: { value: jobWorkingLocation } };
        }

        if (jobStatus) {
            queryFilters.jobStatus = jobStatus;
        }

        if (companyId) {
            queryFilters.companyId = companyId;
        }

        // Default values for limit and page if not provided
        if (!limit) limit = 5;
        if (!page) page = 1;
        // Calculate pagination skip
        const skip = (page - 1) * limit;

        // Query jobs with populated company info, sorted based on sort parameter
        const jobs = await Job.find(queryFilters).populate('companyId').sort(sort).skip(skip).limit(Number(limit));

        // Count total jobs matching query
        const totalJobs = await Job.countDocuments(queryFilters);

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalJobs / limit);

        // Respond with success message and data
        res.status(200).json({ code: 200, message: 'Thành công', jobs, totalPages });
    } catch (error) {
        console.error('getAllJobController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to update job details by jobId
export const updateJobController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { jobDeadline } = req.body;

        // Update job details based on jobId
        await Job.findOneAndUpdate(
            { _id: jobId },
            {
                $set: {
                    ...req.body,
                    jobStatus: checkDatetime(Date.now(), jobDeadline),
                },
            },
            { new: true }, // Return the updated document
        );

        // Retrieve the updated job
        const updatedJob = await Job.findById(jobId);

        // Schedule a job status update based on jobDeadline
        schedule.scheduleJob(updatedJob?.jobDeadline, async () => {
            await Job.findOneAndUpdate({ _id: updatedJob._id }, { jobStatus: 'Hết hạn nộp' });
        });

        // Respond with success message
        res.status(200).json({ code: 200, message: 'Cập nhật thành công' });
    } catch (error) {
        console.error('updateJobController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to decide on an applicant for a job by jobId
 * */
export const decideApplicant = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { userId, status } = req.body;

        // Update applicant status directly in the job document
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId, 'jobApplicants.userId': userId },
            { $set: { 'jobApplicants.$.status': status } },
            { new: true },
        );

        if (!updatedJob) {
            return res.status(404).json({ code: 404, message: 'Job or applicant not found' });
        }

        // Find the updated applicant
        const updatedApplicant = updatedJob.jobApplicants.find((applicant) => applicant.userId.toString() === userId);

        // Create notification for the applicant
        const notificationMessage = `Hồ sơ của bạn đã được ${status.toLowerCase()} cho vị trí ${updatedJob.jobTitle}`;
        const newNotification = new Notification({
            notification: notificationMessage,
            receiverId: userId,
            link: `${process.env.REACT_APP_BASE_URL}/job/applied-job`,
            isRead: false,
        });
        await newNotification.save();

        // Respond with success message and details
        res.status(200).json({
            code: 200,
            message: status === 'Phù hợp' ? 'Đã chấp nhận' : 'Đã từ chối',
            updatedApplicant,
            receiverId: userId,
        });
    } catch (error) {
        console.error('decideApplicant error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to delete a job by employer
export const deleteJobByEmployerController = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy công việc' });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        // Respond with success message
        res.status(200).json({ code: 200, message: 'Xóa thành công' });
    } catch (error) {
        console.error('deleteJobByEmployerController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

//========================

/**
 * Controller to save a job
 * */
export const saveJobController = async (req, res) => {
    try {
        const { jobId } = req.body;

        // Update a JobSave document for the user
        await JobSave.findOneAndUpdate(
            { userId: req.user._id },
            {
                $push: { totalJobs: { jobId, saveTime: Date.now() } },
            },
        );

        // Respond with success message
        res.status(200).json({ code: 200, message: 'Đã lưu công việc' });
    } catch (err) {
        console.error('saveJobController error:', err);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get saved jobs
 * */
export const getSaveJobController = async (req, res) => {
    try {
        // Find JobSave document for the user and populate totalJobs with jobId and companyId details
        const savedJobs = await JobSave.findOne({ userId: req.user._id })
            .populate({
                path: 'totalJobs.jobId',
                populate: {
                    path: 'companyId',
                },
            })
            .lean(); // Use lean() for better performance if you don't need to modify the documents

        // Extract totalSavedJobs from the fetched document
        const allSavedJobs = savedJobs?.totalJobs;

        // Respond with success message and totalJobs data
        res.status(200).json({ code: 200, message: 'Danh sách công việc đã lưu', allSavedJobs });
    } catch (error) {
        console.error('getSaveJobController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to unsave a job
 * */
export const unsaveJobController = async (req, res) => {
    try {
        const { jobId } = req.body;

        // await JobSave.findOneAndUpdate(
        //     { userId: req.user._id },
        //     {
        //         $pull: { totalJobs: { jobId } },
        //     },
        // );
        // Remove the jobId from the totalJobs array in the JobSave document for the user
        await JobSave.findOneAndUpdate({ userId: req.user._id }, { $pull: { totalJobs: { jobId } } });

        // Respond with success message
        res.status(200).json({ code: 200, message: 'Đã bỏ lưu công việc' });
    } catch (error) {
        console.error('unsaveJobController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get recommended jobs
 * */
export const getRecommendJobController = async (req, res) => {
    try {
        // Extract logged-in user's ID from request
        const userId = req.user._id;

        // Destructure query parameters
        let { limit, page } = req.query;
        // Default values for limit and page if not provided
        if (!limit) limit = 5;
        if (!page) page = 1;
        const skip = (page - 1) * limit;

        const userResume = await Resume.findOne({ userId: userId });

        const careers = userResume?.careers?.map((item) => item?.value);
        // console.log('careers: ', careers);
        const skills = userResume?.skills;
        // console.log('skills: ', skills);
        const experience = userResume?.experience;
        // console.log('experience: ', experience);
        const workingLocations = userResume?.workingLocation;
        // console.log('workingLocation: ', workingLocations);

        const query = {
            jobCareers: { $in: careers },
            jobSkills: { $in: skills },
            jobExp: experience,
            // jobWorkingLocation: { $in: workingLocations }, // why not working ?
        };

        const recommendJobs = await Job.find(query)
            .populate('companyId')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        // console.log('recommendJobs: ', recommendJobs);

        const totalJobs = await Job.countDocuments(query);

        const totalPages = Math.ceil(totalJobs / limit);

        res.status(200).json({ code: 200, message: 'Success', recommendJobs, totalPages });
    } catch (error) {
        console.error('getRecommendJobController error:', error);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get related jobs
 * */
export const getRelativeJobController = async (req, res) => {
    try {
        const { jobCareers, jobType } = req.query;

        const relatedJobs = await Job.find({ jobCareers, jobType }).populate('companyId');

        res.status(200).json({ code: 200, message: 'Success', relatedJobs });
    } catch (err) {
        console.error('getRelativeJobController error:', err);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to apply for a job by jobId
 * */
export const applyJobController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { jobId } = req.params;
        const { cvPath, coverLetter } = req.body;

        // Find the company associated with the user
        const job = await Job.findById(jobId).select('companyId jobApplicants');
        // Check if the job exists
        if (!job) {
            return res.status(404).json({ code: 404, message: 'Job not found' });
        }

        const company = await Company.findOne({ userId });
        // Check if the job is owned by the applying user's company
        if (company && job.companyId.equals(company._id)) {
            return res.status(400).json({ code: 400, message: 'Bạn không thể ứng việc làm của chính bạn' });
        }

        // Update job document with applicant details
        await Job.findByIdAndUpdate(jobId, {
            $push: {
                jobApplicants: {
                    userId,
                    appliedTime: Date.now(),
                    cvPath,
                    coverLetter,
                    status: 'Đã ứng tuyển',
                },
            },
        });

        // Create notification for the job company
        const jobCompany = await Company.findById(job.companyId);
        const newNotification = new Notification({
            notification: 'Bạn có 1 đơn ứng tuyển mới',
            receiverId: jobCompany?.userId,
            link: `${process.env.REACT_APP_BASE_URL}/employer/all-applicants/default`,
            isRead: false,
        });
        await newNotification.save();

        res.status(200).json({ code: 200, message: 'Ứng tuyển thành công', receiverId: jobCompany?.userId });
    } catch (err) {
        console.error('applyJobController error:', err);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get applied jobs
 * */
export const getAppliedJob = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find jobs where the current user has applied
        const jobs = await Job.find({ 'jobApplicants.userId': userId }).populate('companyId').sort({ updatedAt: -1 });

        res.status(200).json({ code: 200, message: 'Success', jobs, userId });
    } catch (err) {
        console.error('getAppliedJob error:', err);
        return res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
