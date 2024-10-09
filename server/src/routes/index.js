import { Router } from 'express';

import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import resumeRoutes from './resume-routes.js';
import companyRoutes from './company-routes.js';
import positionRoutes from './position-routes.js';
import categoryRoutes from './category-routes.js';
import skillRoutes from './skill-routes.js';
import jobRoutes from './job-routes.js';
import notificationRoutes from './notification-routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/resume', resumeRoutes);
router.use('/company', companyRoutes);
router.use('/category', categoryRoutes); // profession
router.use('/position', positionRoutes);
router.use('/skill', skillRoutes);
router.use('/job', jobRoutes);
router.use('/notification', notificationRoutes);

export default router;
