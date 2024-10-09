import Category from '../models/Category.js';

/**
 * Controller to create category
 * */
export const createCategoryController = async (req, res) => {
    try {
        const category = await Category.findOne({ category: req.body.category });
        if (category) return res.status(400).json({ code: 400, message: 'Ngành nghề đã tồn tại' });

        const newCategory = new Category(req.body);
        await newCategory.save();

        res.status(200).json({ code: 200, message: 'Tạo ngành nghề thành công' });
    } catch (err) {
        console.error(`Error in createCategoryController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get category details by categoryId
 * */
export const getCategoryByIdController = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        res.status(200).json({ code: 200, message: 'Success', category });
    } catch (err) {
        console.error(`Error in getCategoryByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to get all categories
 * */
export const getAllCategoryController = async (req, res) => {
    try {
        let { limit, page } = req.query;
        
        if (!limit) limit = 5;
        if (!page) page = 1;
        const skip = (page - 1) * limit;

        const categories = await Category.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalCategories = await Category.countDocuments();

        const totalPages = Math.ceil(totalCategories / limit);

        res.status(200).json({ code: 200, message: 'Success', categories, totalPages });
    } catch (err) {
        console.error(`Error in getAllCategoryController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to update category details
 * */
export const updateCategoryByIdController = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const updated = await Category.findByIdAndUpdate(
            categoryId,
            { $set: req.body },
            {
                new: true,
            },
        );

        res.status(200).json({ code: 200, message: 'Cập nhật ngành nghề thành công', updated });
    } catch (err) {
        console.error(`Error in updateCategoryByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};

/**
 * Controller to delete category by categoryId
 * */
export const deleteCategoryByIdController = async (req, res) => {
    try {
        const { categoryId } = req.params;

        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ code: 200, message: 'Xóa ngành nghề thành công' });
    } catch (err) {
        console.error(`Error in deleteCategoryByIdController: ${err}`);
        res.status(500).json({ code: 500, message: 'Unexpected error' });
    }
};
