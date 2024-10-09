import { Router } from 'express';
import {
    getAllNotificationController,
    changeNotificationStatusController,
    deleteNotificationController,
} from '../controllers/notification-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

// Route to get all notifications
router.get('/get-all', verifyToken, getAllNotificationController);

// Route to change notification status
router.patch('/change-status/:notificationId', verifyToken, changeNotificationStatusController);

// Route to delete a notification
router.delete('/delete/:notificationId', verifyToken, deleteNotificationController);

export default router;
