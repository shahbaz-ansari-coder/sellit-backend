// routes/mobileAdsRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import { createJobAd, createKidsAd, createMobileAd, createMotorAd, createPropertyAd } from '../controllers/mobileAdsController.js';

const router = express.Router();

router.post(
    '/mobile-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createMobileAd
);

router.post(
    '/motor-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createMotorAd
);

router.post(
    '/property-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createPropertyAd
);

router.post(
    '/job-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createJobAd
);
router.post(

    '/kids-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createKidsAd
);

export default router;
