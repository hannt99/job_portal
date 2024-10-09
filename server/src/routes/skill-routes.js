import { Router } from 'express';
import {
    createSkillController,
    getSkillByIdController,
    getAllSkillController,
    updateSkillByIdController,
    deleteSkillByIdController,
} from '../controllers/skill-controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/role.js';

const router = Router();

// Route to create skill
router.post('/create', verifyToken, isAdmin, createSkillController);

// Route to get skill details by skillId
router.get('/get/:skillId', getSkillByIdController);

// Route to get all skills
router.get('/get-all', getAllSkillController);

// Route to update skill details
router.put('/update/:skillId', verifyToken, isAdmin, updateSkillByIdController);

// Route to delete skill by skillId
router.delete('/delete/:skillId', verifyToken, isAdmin, deleteSkillByIdController);

export default router;
