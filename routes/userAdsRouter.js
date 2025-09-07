// routes/mobileAdsRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import { createAnimalAd, createBikeAd, createBooksSportsAd, createElectronicsAd, createFashionAd, createFurnitureAd, createJobAd, createKidsAd, createMobileAd, createMotorAd, createPropertyAd, createPropertyRentAd } from '../controllers/mobileAdsController.js';

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

router.post(
    '/bike-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createBikeAd
);
router.post(
    '/property-rent-add/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'attachments', maxCount: 3 }
    ]),
    createPropertyRentAd
);

router.post(
    "/electronics/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 5 },
        { name: "attachments", maxCount: 3 },
    ]),
    createElectronicsAd
);

router.post(
    "/animals/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 5 },
        { name: "attachments", maxCount: 3 },
    ]),
    createAnimalAd
  );

router.post(
    "/fashion/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 5 },
        { name: "attachments", maxCount: 3 },
    ]),
    createFashionAd
  );

router.post(
    "/books/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 5 },
        { name: "attachments", maxCount: 3 },
    ]),
    createBooksSportsAd
  );

router.post(
    "/furniture/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 5 },
        { name: "attachments", maxCount: 3 },
    ]),
    createFurnitureAd
  );


export default router;
