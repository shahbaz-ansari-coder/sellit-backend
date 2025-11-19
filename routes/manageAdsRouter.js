import express from 'express';
import { deleteUserAd, getAllRecentAds, getUserAds } from '../controllers/manageAdsController.js';

const router = express.Router();

router.get('/get-ads/:id', getUserAds);
router.delete("/delete/:subcategory/:id", deleteUserAd);
router.get("/recent-ads", getAllRecentAds);


export default router