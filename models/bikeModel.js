import db from "../config/db.js";

export const insertBikeAd = async (adData) => {
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
        condition,            // <- from req.body
        registration_city,
        features,
        location,
        price,
        seller_name,
        seller_contact,
        image_urls,
        attachment_urls,
        identifier,
        thumbnail_url,
    } = adData;

    // features array/object/string sab handle
    const normalizeJson = (v, fallback) => {
        if (v == null) return fallback;
        if (typeof v === "string") {
            try { return JSON.parse(v); } catch { return fallback; }
        }
        return v;
    };
    const featuresJson = normalizeJson(features, []);
    const imagesJson = Array.isArray(image_urls) ? image_urls : normalizeJson(image_urls, []);
    const attachmentsJson = Array.isArray(attachment_urls) ? attachment_urls : normalizeJson(attachment_urls, []);

    const [result] = await db.query(
        `INSERT INTO bike_ads (
      sub_category, ad_title, description,
      make, model, \`year\`, engine_type, engine_capacity,
      kms_driven, ignition_type, origin, bike_condition, registration_city,
      features, location, price,
      seller_name, seller_contact, image_urls, attachment_urls,
      identifier, thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
            condition, // maps to bike_condition col
            registration_city,
            JSON.stringify(featuresJson),
            location,
            price,
            seller_name,
            seller_contact,
            JSON.stringify(imagesJson),
            JSON.stringify(attachmentsJson),
            identifier,
            thumbnail_url,
        ]
    );

    return result.insertId;
};
