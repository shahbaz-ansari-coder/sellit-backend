// controllers/mobileAdsController.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { insertMobileAd , findUserById } from '../models/mobileAdsModel.js';
import { insertMotorAd } from "../models/motorsAdsModel.js";
import { insertPropertyAd } from '../models/propertyAdsModel.js';
import { insertJobAd } from "../models/jobModel.js";
import { insertKidsAd } from "../models/kidsModel.js";


const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


export const createMobileAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ User find by ID
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files['thumbnail']) {
      const result = await uploadToCloudinary(
        req.files['thumbnail'][0].buffer,
        'mobile_ads/thumbnails'
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Multiple images upload
    let imageUrls = [];
    if (req.files['images']) {
      for (let file of req.files['images']) {
        const result = await uploadToCloudinary(file.buffer, 'mobile_ads/images');
        imageUrls.push(result.secure_url);
      }
    }

    // ✅ Attachments upload
    let attachmentUrls = [];
    if (req.files['attachments']) {
      for (let file of req.files['attachments']) {
        const result = await uploadToCloudinary(file.buffer, 'mobile_ads/attachments');
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body se data extract
    const {
      sub_category,
      ad_title,
      description,
      brand,
      phone_condition,
      location,
      price,
      seller_name,
      seller_contact
    } = req.body;

    // ✅ Save in DB
    const newAd = await insertMobileAd({
      sub_category,
      ad_title,
      description,
      brand,
      phone_condition,
      location,
      price,
      seller_name,
      seller_contact,
      image_urls: imageUrls,         // ✅ Array as links
      attachment_urls: attachmentUrls, // ✅ Array as links
      identifier: user.identifier,        // ✅ User email as identifier
      thumbnail_url: thumbnailUrl
    });

    return res.status(201).json({
      message: '✅ Mobile ad created successfully',
      ad: newAd
    });

  } catch (error) {
    console.error("❌ Error creating mobile ad:", error);
    res.status(500).json({ message: "Error creating mobile ad", error });
  }
};


export const createMotorAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ User find by ID
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "motors_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Multiple images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(file.buffer, "motors_ads/images");
        imageUrls.push(result.secure_url);
      }
    }

    // ✅ Attachments upload
    let attachmentUrls = [];
    if (req.files["attachments"]) {
      for (let file of req.files["attachments"]) {
        const result = await uploadToCloudinary(file.buffer, "motors_ads/attachments");
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Extract data from body
    const {
      sub_category,
      ad_title,
      description,
      make,
      car_condition,
      year,
      fuel,
      transmission,
      body_type,
      color,
      number_of_seats,
      features,
      number_of_owners,
      car_documents,
      assembly,
      location,
      price,
      seller_name,
      seller_contact
    } = req.body;

    // ✅ Save in DB
    const newAd = await insertMotorAd({
      sub_category,
      ad_title,
      description,
      make,
      car_condition,
      year,
      fuel,
      transmission,
      body_type,
      color,
      number_of_seats,
      features: Array.isArray(features) ? features : JSON.parse(features || "[]"),
      number_of_owners,
      car_documents,
      assembly,
      location,
      price,
      seller_name,
      seller_contact,
      image_urls: imageUrls,
      attachment_urls: attachmentUrls,
      identifier: user.identifier, 
      thumbnail_url: thumbnailUrl,
    });

    return res.status(201).json({
      message: "✅ Motor ad created successfully",
      ad: newAd,
    });

  } catch (error) {
    console.error("❌ Error creating motor ad:", error);
    res.status(500).json({ message: "Error creating motor ad", error });
  }
};

export const createPropertyAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ User check
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "property_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "property_ads/images"
        );
        imageUrls.push(result.secure_url);
      }
    }

    // ✅ Attachments upload
    let attachmentUrls = [];
    if (req.files["attachments"]) {
      for (let file of req.files["attachments"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "property_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body se data
    const {
      sub_category,
      ad_title,
      description,
      type,
      electricity_connection,
      gas_connection,
      water_supply,
      sewerage_system,
      road_access,
      boundary_wall,
      corner_plot,
      park_facing,
      area_unit,
      area,
      location,
      price,
      seller_name,
      seller_contact
    } = req.body;

    // ✅ Insert in DB
    const newAdId = await insertPropertyAd({
      sub_category,
      ad_title,
      description,
      type,
      electricity_connection,
      gas_connection,
      water_supply,
      sewerage_system,
      road_access,
      boundary_wall,
      corner_plot,
      park_facing,
      area_unit,
      area,
      location,
      price,
      seller_name,
      seller_contact,
      image_urls: imageUrls,
      attachment_urls: attachmentUrls,
      identifier: user.identifier,
      thumbnail_url: thumbnailUrl,
    });

    return res.status(201).json({
      message: "✅ Property ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating property ad:", error);
    res.status(500).json({ message: "Error creating property ad", error });
  }
};

export const createJobAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ User find by ID
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files['thumbnail']) {
      const result = await uploadToCloudinary(
        req.files['thumbnail'][0].buffer,
        'job_ads/thumbnails'
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Images upload
    let imageUrls = [];
    if (req.files['images']) {
      for (let file of req.files['images'].slice(0, 5)) {
        const result = await uploadToCloudinary(file.buffer, 'job_ads/images');
        imageUrls.push(result.secure_url);
      }
    }

    // ✅ Attachments upload
    let attachmentUrls = [];
    if (req.files['attachments']) {
      for (let file of req.files['attachments']) {
        const result = await uploadToCloudinary(file.buffer, 'job_ads/attachments');
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body data
    const {
      sub_category,
      job_category,
      job_title,
      description,
      hiring_type,
      company_name,
      type_of_ad,
      salary_from,
      salary_to,
      career_level,
      salary_period,
      position_type,
      location,
      seller_name,
      seller_contact
    } = req.body;

    // ✅ Save in DB
    const newAd = await insertJobAd({
      sub_category,
      job_category,
      job_title,
      description,
      hiring_type,
      company_name,
      type_of_ad,
      salary_from,
      salary_to,
      career_level,
      salary_period,
      position_type,
      location,
      seller_name,
      seller_contact,
      image_urls: imageUrls,
      attachment_urls: attachmentUrls,
      identifier: user.identifier,
      thumbnail_url: thumbnailUrl
    });

    res.status(201).json({ message: "✅ Job ad created successfully", ad: newAd });

  } catch (error) {
    console.error("❌ Error creating job ad:", error);
    res.status(500).json({ message: "Error creating job ad", error });
  }
};

export const createKidsAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find user
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files['thumbnail']) {
      const result = await uploadToCloudinary(
        req.files['thumbnail'][0].buffer,
        'kids_ads/thumbnails'
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Multiple images upload
    let imageUrls = [];
    if (req.files['images']) {
      for (let file of req.files['images']) {
        const result = await uploadToCloudinary(file.buffer, 'kids_ads/images');
        imageUrls.push(result.secure_url);
      }
    }

    // ✅ Attachments upload
    let attachmentUrls = [];
    if (req.files['attachments']) {
      for (let file of req.files['attachments']) {
        const result = await uploadToCloudinary(file.buffer, 'kids_ads/attachments');
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Extract body data
    const {
      sub_category,
      ad_title,
      description,
      item_type,
      age_group,
      brand,
      condition,
      features,
      location,
      price,
      seller_name,
      seller_contact
    } = req.body;

    // ✅ Save to DB
    const newAd = await insertKidsAd({
      sub_category,
      ad_title,
      description,
      item_type,
      age_group,
      brand,
      condition,
      features: features ? JSON.parse(features) : [],
      location,
      price,
      seller_name,
      seller_contact,
      image_urls: imageUrls,
      attachment_urls: attachmentUrls,
      identifier: user.identifier,
      thumbnail_url: thumbnailUrl
    });

    return res.status(201).json({
      message: "✅ Kids ad created successfully",
      ad: newAd
    });

  } catch (error) {
    console.error("❌ Error creating kids ad:", error);
    res.status(500).json({ message: "Error creating kids ad", error });
  }
};
