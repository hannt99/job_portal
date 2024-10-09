import { Router } from 'express';
import {
    createPositionController,
    getPositionByIdController,
    getAllPositionController,
    updatePositionByIdController,
    deletePositionByIdController,
} from '../controllers/position-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/role.js';

const router = Router();

// Route to create position
router.post('/create', verifyToken, isAdmin, createPositionController);

// Route to get position details by positionId
router.get('/get/:positionId', getPositionByIdController);

// Route to get all positions
router.get('/get-all', getAllPositionController);

// Route to update position details
router.put('/update/:positionId', verifyToken, isAdmin, updatePositionByIdController);

// Route to delete position by positionId
router.delete('/delete/:positionId', verifyToken, isAdmin, deletePositionByIdController);

export default router;
