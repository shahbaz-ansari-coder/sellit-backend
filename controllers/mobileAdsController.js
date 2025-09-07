// controllers/mobileAdsController.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import db from "../config/db.js";

import { insertMobileAd , findUserById } from '../models/mobileAdsModel.js';
import { insertMotorAd } from "../models/motorsAdsModel.js";
import { insertPropertyAd } from '../models/propertyAdsModel.js';
import { insertJobAd } from "../models/jobModel.js";
import { insertKidsAd } from "../models/kidsModel.js";
import { insertPropertyRentAd } from '../models/propertyRentModel.js';
import { insertBikeAd } from '../models/bikeModel.js';
import { insertElectronicsAd } from "../models/electronicsModel.js";
import { insertAnimalAd } from "../models/animalModel.js";
import { insertFashionAd } from "../models/fashionModel.js";
import { insertBooksSportsAd } from "../models/booksSportsModel.js";
import { insertFurnitureAd } from "../models/furnitureModel.js";

// ✅ Cloudinary upload function
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
      image_urls: imageUrls,         
      attachment_urls: attachmentUrls,
      identifier: user.identifier,     
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

export const createPropertyRentAd = async (req, res) => {
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
        "property_rent_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "property_rent_ads/images"
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
          "property_rent_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body se data
    const {
      sub_category,
      property_type,
      ad_title,
      description,
      furnished,
      bedrooms,
      bathrooms,
      storeys,
      construction_state,
      features, // JSON string aayega
      area_unit,
      area,
      location,
      rent_price,
      seller_name,
      seller_contact
    } = req.body;

    // ✅ Insert in DB
    const newAdId = await insertPropertyRentAd({
      sub_category,
      property_type,
      ad_title,
      description,
      furnished,
      bedrooms,
      bathrooms,
      storeys,
      construction_state,
      features: JSON.parse(features || "{}"),
      area_unit,
      area,
      location,
      rent_price,
      seller_name,
      seller_contact,
      image_urls: imageUrls,
      attachment_urls: attachmentUrls,
      identifier: user.identifier,
      thumbnail_url: thumbnailUrl,
    });

    return res.status(201).json({
      message: "Property Rent Ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating property rent ad:", error);
    res.status(500).json({ message: "Error creating property rent ad", error });
  }
};

export const createBikeAd = async (req, res) => {
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
        "bike_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "bike_ads/images"
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
          "bike_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body se data
    const {
      sub_category,
      ad_title,
      description,
      make,
      model,
      year,
      engine_type,
      engine_capacity,
      kms_driven,
      ignition_type,
      origin,
      condition,
      registration_city,
      features, // JSON string hoga
      location,
      price,
      seller_name,
      seller_contact,
    } = req.body;

    // ✅ Insert into DB
    const newAdId = await insertBikeAd({
      sub_category,
      ad_title,
      description,
      make,
      model,
      year,
      engine_type,
      engine_capacity,
      kms_driven,
      ignition_type,
      origin,
      condition,
      registration_city,
      features: JSON.parse(features || "{}"),
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
      message: "✅ Bike ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating bike ad:", error);
    res.status(500).json({ message: "Error creating bike ad", error });
  }
};

export const createElectronicsAd = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 User check
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔹 Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "electronics_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // 🔹 Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "electronics_ads/images"
        );
        imageUrls.push(result.secure_url);
      }
    }

    // 🔹 Attachments upload
    let attachmentUrls = [];
    if (req.files["attachments"]) {
      for (let file of req.files["attachments"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "electronics_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // 🔹 Body data
    const {
      sub_category,
      ad_title,
      description,
      type,
      brand,
      model,
      condition,
      warranty,
      features, // JSON string hoga
      location,
      price,
      seller_name,
      seller_contact,
    } = req.body;

    // 🔹 Insert into DB
    const newAdId = await insertElectronicsAd({
      sub_category,
      ad_title,
      description,
      type,
      brand,
      model,
      condition,
      warranty,
      features: JSON.parse(features || "{}"),
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
      message: "✅ Electronics ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating electronics ad:", error);
    res.status(500).json({ message: "Error creating electronics ad", error });
  }
};

export const createAnimalAd = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 User check
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔹 Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "animal_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // 🔹 Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "animal_ads/images"
        );
        imageUrls.push(result.secure_url);
      }
    }

    // 🔹 Attachments upload
    let attachmentUrls = [];
    if (req.files["attachments"]) {
      for (let file of req.files["attachments"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "animal_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // 🔹 Body data
    const {
      sub_category,
      ad_title,
      description,
      type_of_animal,
      breed,
      sex,
      age,
      color,
      vaccination_status,
      features, // JSON string hoga
      location,
      price,
      seller_name,
      seller_contact,
    } = req.body;

    // 🔹 Insert DB
    const newAdId = await insertAnimalAd({
      sub_category,
      ad_title,
      description,
      type_of_animal,
      breed,
      sex,
      age,
      color,
      vaccination_status,
      features: JSON.parse(features || "{}"),
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
      message: "✅ Animal ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating animal ad:", error);
    res.status(500).json({ message: "Error creating animal ad", error });
  }
};

export const createFashionAd = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 User check
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔹 Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "fashion_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // 🔹 Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "fashion_ads/images"
        );
        imageUrls.push(result.secure_url);
      }
    }

    // 🔹 Attachments upload
    let attachmentUrls = [];
    if (req.files["attachments"]) {
      for (let file of req.files["attachments"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "fashion_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // 🔹 Body data
    const {
      sub_category,
      ad_title,
      description,
      sex_gender,
      brand,
      size,
      color,
      material,
      condition,
      type,
      features, // JSON string hoga
      location,
      price,
      seller_name,
      seller_contact,
    } = req.body;

    // 🔹 Insert DB
    const newAdId = await insertFashionAd({
      sub_category,
      ad_title,
      description,
      sex_gender,
      brand,
      size,
      color,
      material,
      condition,
      type,
      features: JSON.parse(features || "{}"),
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
      message: "✅ Fashion ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating fashion ad:", error);
    res.status(500).json({ message: "Error creating fashion ad", error });
  }
};

export const createBooksSportsAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ User check
    const [userRows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "books_sports_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "books_sports_ads/images"
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
          "books_sports_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body data
    const {
      sub_category,
      ad_title,
      description,
      item_type,
      genre_category,
      author_artist_brand,
      condition,
      language,
      format,
      features,
      location,
      price,
      seller_name,
      seller_contact,
    } = req.body;

    // ✅ Insert into DB
    const newAdId = await insertBooksSportsAd({
      sub_category,
      ad_title,
      description,
      item_type,
      genre_category,
      author_artist_brand,
      condition,
      language,
      format,
      features: JSON.parse(features || "{}"),
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
      message: "✅ Books/Sports/Hobbies ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating Books/Sports/Hobbies ad:", error);
    res
      .status(500)
      .json({ message: "Error creating Books/Sports/Hobbies ad", error });
  }
};

export const createFurnitureAd = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ User check
    const [userRows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"]) {
      const result = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "furniture_ads/thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    // ✅ Images upload
    let imageUrls = [];
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        const result = await uploadToCloudinary(
          file.buffer,
          "furniture_ads/images"
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
          "furniture_ads/attachments"
        );
        attachmentUrls.push(result.secure_url);
      }
    }

    // ✅ Body se data
    const {
      sub_category,
      ad_title,
      description,
      item_type,
      material,
      brand,
      condition,
      dimensions,
      features,
      location,
      price,
      seller_name,
      seller_contact,
    } = req.body;

    // ✅ Insert into DB
    const newAdId = await insertFurnitureAd({
      sub_category,
      ad_title,
      description,
      item_type,
      material,
      brand,
      condition,
      dimensions,
      features: JSON.parse(features || "{}"),
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
      message: "✅ Furniture ad created successfully",
      ad_id: newAdId,
    });
  } catch (error) {
    console.error("❌ Error creating Furniture ad:", error);
    res.status(500).json({ message: "Error creating Furniture ad", error });
  }
};