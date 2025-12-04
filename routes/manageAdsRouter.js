import express from 'express';
import { deleteUserAd, getAllRecentAds, getSingleAd, getUserAds, searchAds } from '../controllers/manageAdsController.js';

const router = express.Router();
// GET USERS ADS BY ID
router.get('/get-ads/:id', getUserAds);
// DELETE AD USER ADS BY ID
router.delete("/delete/:subcategory/:id", deleteUserAd);
// GET ALL RECENT ADS
router.get("/recent-ads", getAllRecentAds);
// GET AD BY ID
router.get("/get-ad/:table/:id", getSingleAd);
router.get("/search", searchAds);


export default router