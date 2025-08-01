import express from 'express';
import {  addUserByAdmin, blockUser, deleteUser, getSingleUser, getUsers, unblockUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/get-users/:id', getUsers);
router.get('/get-user/:id', getSingleUser);
router.post('/add-user', addUserByAdmin);
router.put('/update-user/:id', updateUser);
router.delete('/delete-user/:id', deleteUser);
router.put('/block-user/:id', blockUser);
router.put('/unblock-user/:id', unblockUser);

export default router