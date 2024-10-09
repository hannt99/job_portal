import { Router } from 'express';
import {
    getAllUsersExceptLoggedUserController,
    getJobChartDataController,
    getAdminDashboardController,
    getCandidateChartDataController,
    getEmployerDashboardController,
    changeAvatarController,
    changeJobSeekingStatusController,
    changeProfileVisibilityController,
    changePasswordController,
    updateUserController,
    deleteUserByIdController,
} from '../controllers/user-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isEmployer, isAdmin } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';

const router = Router();

// Route to get all users
router.get('/get-all', verifyToken, isAdmin, getAllUsersExceptLoggedUserController);

// Route to get jobs dashboard
router.get('/get-job-chart', verifyToken, isAdmin, getJobChartDataController);

// Route to get admin dashboard
router.get('/get-admin-dashboard', verifyToken, isAdmin, getAdminDashboardController);

// Route to get candidate dashboard
router.get('/get-candidate-chart', verifyToken, isEmployer, getCandidateChartDataController);

// Route to get employer dashboard
router.get('/get-employer-dashboard', verifyToken, isEmployer, getEmployerDashboardController);

//========================

// Route to change user avatar
router.post('/change-avatar', verifyToken, upload.single('avatar'), changeAvatarController);

// Route to change the user's job-seeking status
router.patch('/change-job-seeking-status', verifyToken, changeJobSeekingStatusController);

// Route to change profile visibility
router.patch('/change-profile-visibility', verifyToken, changeProfileVisibilityController);

// Route to change user password
router.patch('/change-password', verifyToken, changePasswordController);

// Route to update user details
router.patch('/update', verifyToken, updateUserController);

// Route to delete a user by userId
router.delete('/delete/:userId', verifyToken, isAdmin, deleteUserByIdController);

export default router;
