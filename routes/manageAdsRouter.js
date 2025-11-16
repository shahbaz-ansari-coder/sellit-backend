import express from 'express';
import { deleteUserAd, getUserAds } from '../controllers/manageAdsController.js';

const router = express.Router();

router.get('/get-ads/:id', getUserAds);
router.delete("/delete/:subcategory/:id", deleteUserAd);


export default router