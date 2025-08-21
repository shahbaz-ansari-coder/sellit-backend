import express from 'express';
import { getUserAds } from '../controllers/manageAdsController.js';

const router = express.Router();

router.get('/get-ads/:id', getUserAds);


export default router