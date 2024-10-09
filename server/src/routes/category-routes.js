import { Router } from 'express';
import {
    createCategoryController,
    getCategoryByIdController,
    getAllCategoryController,
    updateCategoryByIdController,
    deleteCategoryByIdController,
} from '../controllers/category-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/role.js';

const router = Router();

// Route to create category
router.post('/create', verifyToken, isAdmin, createCategoryController);

// Route to get category details by categoryId
router.get('/get/:categoryId', getCategoryByIdController);

// Route to get all categories
router.get('/get-all', getAllCategoryController);

// Route to update category details
router.put('/update/:categoryId', verifyToken, isAdmin, updateCategoryByIdController);

// Route to delete category by categoryId
router.delete('/delete/:categoryId', verifyToken, isAdmin, deleteCategoryByIdController);

export default router;
