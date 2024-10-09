import { Router } from 'express';
import {
    getResumeController,
    uploadCVController,
    getAllCVController,
    setMainCVController,
    updateResumeController,
    deleteCVController,
    recommendCVController,
} from '../controllers/resume-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isEmployer } from '../middlewares/role.js';
import upload from '../utils/uploadFile.js';

const router = Router();

// Route to get a Resume
router.get('/get', verifyToken, getResumeController);

// Route to upload CVs
router.post('/upload-cv', verifyToken, upload.array('myCV', 10), uploadCVController);

// Route to get all CVs
router.get('/get-all-cv', verifyToken, getAllCVController);

// Route to set main CV
router.patch('/set-main-cv', verifyToken, setMainCVController);

// Route to update a Resume
router.patch('/update', verifyToken, updateResumeController);

// Route to delete a cv
router.patch('/delete-cv', verifyToken, deleteCVController);

// Route to get recommended Resumes
router.get('/recommend-cv', verifyToken, isEmployer, recommendCVController);

export default router;
