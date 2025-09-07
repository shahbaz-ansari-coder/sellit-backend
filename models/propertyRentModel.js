import db from "../config/db.js";

export const insertPropertyRentAd = async (adData) => {
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
        features,
        area_unit,
        area,
        location,
        rent_price,
        seller_name,
        seller_contact,
        image_urls,
        attachment_urls,
        identifier,
        thumbnail_url,
    } = adData;

    const [result] = await db.query(
        `INSERT INTO property_rent_ads (
      sub_category, property_type, ad_title, description,
      furnished, bedrooms, bathrooms, storeys, construction_state,
      features, area_unit, area, location, rent_price,
      seller_name, seller_contact, image_urls, attachment_urls,
      identifier, thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            sub_category,
            property_type,
            ad_title,
            description,
            furnished ? 1 : 0,
            bedrooms,
            bathrooms,
            storeys,
            construction_state,
            JSON.stringify(features),
            area_unit,
            area,
            location,
            rent_price,
            seller_name,
            seller_contact,
            JSON.stringify(image_urls),
            JSON.stringify(attachment_urls),
            identifier,
            thumbnail_url,
        ]
    );

    return result.insertId;
};

export const findUserById = async (id) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0];
};
