import { Router } from 'express';
import {
    createJobController,
    getJobController,
    getAllJobByEmployerController,
    getActiveJobByEmployerController,
    getApplicantsByJob,
    getAllJobController,
    updateJobController,
    decideApplicant,
    deleteJobByEmployerController,
    saveJobController,
    getSaveJobController,
    unsaveJobController,
    getRelativeJobController,
    getRecommendJobController,
    applyJobController,
    getAppliedJob,
} from '../controllers/job-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isEmployer } from '../middlewares/role.js';

const router = Router();

// Route to create a job
router.post('/create', verifyToken, isEmployer, createJobController);

// Route to get job details by jobId
router.get('/get/:jobId', getJobController);

// Route to get all jobs by employer
router.get('/get-all-by-employer', verifyToken, isEmployer, getAllJobByEmployerController);

// Route to get active jobs by employer
router.get('/get-active-job-by-employer', verifyToken, isEmployer, getActiveJobByEmployerController);

// Route to get applicants by job
router.get('/get-applicants-by-job', verifyToken, isEmployer, getApplicantsByJob);

// Route to get all jobs (for candidates)
router.get('/get-all', getAllJobController);

// Route to update job details by jobId
router.put('/update/:jobId', verifyToken, isEmployer, updateJobController);

// Route to decide on an applicant for a job by jobId
router.patch('/decide-applicant/:jobId', verifyToken, isEmployer, decideApplicant);

// Route to delete a job by employer
router.delete('/delete/:jobId', verifyToken, isEmployer, deleteJobByEmployerController);

//========================

// Route to save a job
router.patch('/save-job', verifyToken, saveJobController);

// Route to get saved jobs
router.get('/get-save-job', verifyToken, getSaveJobController);

// Route to unsave a job
router.patch('/unsave-job', verifyToken, unsaveJobController);

// Route to get related jobs
router.get('/get-relative-job', getRelativeJobController);

// Route to get recommended jobs
router.get('/get-recommend-job', verifyToken, getRecommendJobController);

// Route to apply for a job by jobId
router.patch('/apply-job/:jobId', verifyToken, applyJobController);

// Route to get applied jobs
router.get('/get-applied-job', verifyToken, getAppliedJob);

export default router;
