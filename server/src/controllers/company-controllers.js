import Company from '../models/Company.js';

/**
 * Controller to get company details by companyId
 * */
export const getCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ code: 404, message: 'Company not found' });
        }

        res.status(200).json({ code: 200, message: 'Success', company });
    } catch (err) {
        console.error(`Error in getCompanyController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to get company by employer
export const getCompanyByEmployerController = async (req, res) => {
    try {
        // The logged-in user's ID
        const userId = req.user._id;

        const company = await Company.findOne({ userId: userId });
        if (!company) {
            return res.status(404).json({ code: 404, message: 'Company not found' });
        }

        res.status(200).json({ code: 200, message: 'Success', company });
    } catch (err) {
        console.error(`Error in getCompanyByEmployerController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get all companies
 * */
export const getAllCompanyController = async (req, res) => {
    try {
        // Destructure query parameters
        let { search, sort, limit, page } = req.query;

        // Prepare query filters based on search parameter
        let queryFilters = {};
        if (search) {
            queryFilters = { companyName: { $regex: search, $options: 'i' } };
        }

        // Default values for limit and page if not provided
        if (!limit) limit = 5;
        if (!page) page = 1;
        // Calculate pagination skip
        const skip = (page - 1) * limit;

        // Query companies
        const companies = await Company.find(queryFilters).sort(sort).skip(skip).limit(Number(limit));

        // Count total companies matching query
        const totalCompanies = await Company.countDocuments(queryFilters);

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCompanies / limit);

        // Respond with success message and data
        res.status(200).json({ code: 200, message: 'Success', companies, totalPages });
    } catch (err) {
        console.error(`Error in getAllCompanyController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to update company details
 * */
export const updateCompanyController = async (req, res) => {
    try {
        await Company.findOneAndUpdate(
            { userId: req.user._id },
            { $set: req.body },
            {
                new: true,
            },
        );
        res.status(200).json({ code: 200, message: 'Cập nhật thành công' });
    } catch (err) {
        console.error(`Error in updateCompanyController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to change company avatar
 * */
export const changeAvatarController = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ code: 400, message: 'Hãy chọn 1 ảnh' });
        }

        const fileUrl = process.env.BASE_URL + `/static/${file.filename}`;
        await Company.findOneAndUpdate({ userId: req.user._id }, { avatar: fileUrl });
        
        res.status(200).json({ code: 200, message: 'Thay đổi ảnh nền thành công', fileName: file.filename });
    } catch (err) {
        console.error(`Error in changeAvatarController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to add a follower to a company by companyId
 * */
export const addFollowerController = async (req, res) => {
    try {
        const { companyId } = req.params;

        await Company.findByIdAndUpdate(companyId, {
            $push: { followers: req.user._id },
        });

        res.status(200).json({ code: 200, message: 'Đã theo dõi' });
    } catch (err) {
        console.error(`Error in addFollowerController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

// Controller to get all followed companies
export const getAllFollowedCompanyController = async (req, res) => {
    try {
        let { page, limit } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 5;
        const skip = (page - 1) * limit;

        // Query database for followed companies
        const companies = await Company.find({ followers: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Count total followed companies
        const totalCompanies = await Company.countDocuments({ followers: req.user._id });
        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCompanies / limit);

        res.status(200).json({ code: 200, message: 'Success', companies, totalPages });
    } catch (err) {
        console.error(`Error in getAllFollowedCompanyController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to remove a follower from a company by companyId
 * */
export const removeFollowerController = async (req, res) => {
    try {
        const { companyId } = req.params;

        await Company.findByIdAndUpdate(companyId, {
            $pull: { followers: req.user._id },
        });

        res.status(200).json({ code: 200, message: 'Đã hủy theo dõi' });
    } catch (err) {
        console.error(`Error in removeFollowerController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
