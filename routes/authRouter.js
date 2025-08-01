import express from 'express';
import { googleLogin, login, resetPassword, sendOtp, signup, verifyOtp } from '../controllers/authConroller.js';

const router = express.Router();

router.post('/login' , login);
router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);

export default router