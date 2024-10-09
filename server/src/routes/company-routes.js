import { Router } from 'express';
import {
    getCompanyController,
    getCompanyByEmployerController,
    getAllCompanyController,
    updateCompanyController,
    changeAvatarController,
    addFollowerController,
    getAllFollowedCompanyController,
    removeFollowerController,
} from '../controllers/company-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isEmployer } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';

const router = Router();

// Route to get company details by companyId
router.get('/get/:companyId', getCompanyController);

// Route to get company by employer
router.get('/get-by-employer', verifyToken, isEmployer, getCompanyByEmployerController);

// Route to get all companies
router.get('/get-all', getAllCompanyController);

// Route to change company avatar
router.post('/change-avatar', verifyToken, isEmployer, upload.single('companyAvatar'), changeAvatarController);

// Route to update company details
router.patch('/update', verifyToken, isEmployer, updateCompanyController);

//========================

// Route to add a follower to a company by companyId
router.patch('/add-follower/:companyId', verifyToken, addFollowerController);

// Route to get all followed companies route
router.get('/get-all-followed-company', verifyToken, getAllFollowedCompanyController);

// Route to remove a follower from a company by companyId
router.patch('/remove-follower/:companyId', verifyToken, removeFollowerController);

export default router;
