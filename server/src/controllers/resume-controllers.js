import Resume from '../models/Resume.js';
// import Company from '../models/Company.js';
import Job from '../models/Job.js';

/**
 * Controller to get a Resume
 * */
export const getResumeController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        const resume = await Resume.findOne({ userId: userId }).populate('userId', '-password -role');
        if (!resume) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy Resume' });
        }

        res.status(200).json({ code: 200, message: 'Thành công', resume });
    } catch (err) {
        console.error('Error in getResumeController:', err);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

// Controller to upload CVs
export const uploadCVController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        const files = req.files;
        // Check if files are provided
        if (!files || files.length === 0) {
            return res.status(400).json({ code: 400, message: 'Hãy chọn ít nhất 1 file' });
        }

        // Create URLs for each file
        const fileUrls = files.map((file) => ({
            name: file.filename,
            path: `${process.env.BASE_URL}/static/${file.filename}`,
        }));

        // Prepare the update operations
        const updateOperations = fileUrls.map((file) => ({
            updateOne: {
                filter: { userId },
                update: { $push: { cv: { isMain: false, name: file.name, path: file.path } } },
            },
        }));

        // Perform the batch update
        // This method prepares multiple update operations in a single call to the database, improving performance and reducing overhead
        await Resume.bulkWrite(updateOperations);

        res.status(200).json({ code: 200, message: 'Tải lên CV thành công' });
    } catch (err) {
        console.error('Error in uploadCVController:', err);
        res.status(500).json({ code: 500, message: 'Unexpected error occurred.' });
    }
};

// Controller to get all CVs
export const getAllCVController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        const resume = await Resume.findOne({ userId: userId });
        // Handle case where resume is not found
        if (!resume) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy Resume' });
        }

        const cvs = resume?.cv;

        res.status(200).json({ code: 200, message: 'Thành công', cvs });
    } catch (err) {
        console.error('Error in getAllCVController:', err);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

// Controller to set main CV
export const setMainCVController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        const { filename } = req.body;
        // Check if filename is provided
        if (!filename) {
            return res.status(400).json({ code: 400, message: 'Filename is required' });
        }

        // Find the resume associated with the user
        const resume = await Resume.findOne({ userId });
        if (!resume) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy Resume' });
        }

        // Separate the CV items into the main one and the rest
        const updatedCVs = resume.cv.map((cv) => ({
            ...cv,
            isMain: cv.name === filename,
        }));

        // Update the resume with the modified CVs
        await Resume.findOneAndUpdate({ userId }, { cv: updatedCVs });

        res.status(200).json({ code: 200, message: 'Đặt CV chính thành công' });
    } catch (err) {
        console.error('Error in setMainCVController:', err);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

// Controller to update a Resume
export const updateResumeController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        await Resume.findOneAndUpdate(
            { userId: userId },
            { $set: req.body },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Cập nhật thành công' });
    } catch (err) {
        console.error('Error in updateResumeController:', err);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

// Controller to delete a CV
export const deleteCVController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        const { filename } = req.body;
        // Check if filename is provided
        if (!filename) {
            return res.status(400).json({ code: 400, message: 'Filename is required' });
        }

        // Find the resume associated with the user
        const resume = await Resume.findOne({ userId: userId });

        // Check if resume exists
        if (!resume) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy Resume' });
        }

        // Filter out the CV with the given filename
        const updatedCVs = resume.cv.filter((cv) => cv.name !== filename);

        // Update the resume with the filtered CVs
        await Resume.findOneAndUpdate({ userId: userId }, { cv: updatedCVs });

        res.status(200).json({ code: 200, message: 'Xóa CV thành công' });
    } catch (err) {
        console.error('Error in deleteCVController:', err);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

/**
 * Controller to get recommended Resumes
 * */
export const recommendCVController = async (req, res) => {
    try {
        // Get user ID from request
        const userId = req.user._id;

        const { jobId } = req.query;
        // Validate jobId query parameter
        if (!jobId) {
            return res.status(400).json({ code: 400, message: 'Job ID is required' });
        }

        // Fetch the job details
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ code: 404, message: 'Job not found' });
        }

        // Fetch resumes matching the job requirements, excluding the current user
        const resumes = await Resume.find({
            skills: { $in: job.jobSkills },
            experience: job.jobExp,
            userId: { $ne: userId }, // Exclude resumes of the current user
        }).populate('userId', '-password -role');

        // Send the response with recommended resumes
        res.status(200).json({ code: 200, message: 'Thành công', resumes });
    } catch (err) {
        console.error('Error in recommendCVController:', err);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

// export const recommendCVController = async (req, res) => {
//     try {
//         const company = await Company.findOne({ userId: req.user._id });
//         const jobs = await Job.find({ companyId: company?._id, jobStatus: 'Đang tuyển' });

//         const result = await Promise.all(
//             jobs?.map(async (item) => {
//                 let resumes = await Resume.find({
//                     skills: { $in: item?.jobSkills },
//                     experience: item?.jobExp,
//                 }).populate('userId', '-password -role');
//                 resumes = resumes?.filter((item) => item?.userId?._id != req.user._id);
//                 return {
//                     jobTitle: item?.jobTitle,
//                     recommendCV: resumes,
//                 };
//             }),
//         );

//         res.status(200).json({ code: 200, message: 'Success', result });
//     } catch (error) {
//         res.status(400).json({ code: 400, message: 'Unexpected error' });
//         console.log(error);
//     }
// };
