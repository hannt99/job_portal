import { Router } from 'express';
import {
    signInController,
    registerController,
    verifyAccountController,
    forgotPasswordController,
    resetPasswordController,
    getCurrentUserController,
    signOutController,
} from '../controllers/auth-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

// Route to Sign in
router.post('/signin', signInController);

// Route to Register
router.post('/register', registerController);

// Route to Verify account
router.get('/verify-account', verifyAccountController);

// Route to Forgot password
router.post('/forgot-password', forgotPasswordController);

// Route to Reset password
router.patch('/reset-password', resetPasswordController);

// Route to Get current user
router.get('/current-user', verifyToken, getCurrentUserController);

// Route to Sign out
router.get('/signout', verifyToken, signOutController);

export default router;
