import express from 'express';
import { addTeamMemberByAdmin, editTeamMemberByAdmin, getTeamMembers } from '../controllers/teamController.js';

const router = express.Router();

router.get('/get-team/:id', getTeamMembers);
router.post('/add-team/', addTeamMemberByAdmin);
router.put('/edit-team/:id', editTeamMemberByAdmin);


export default router