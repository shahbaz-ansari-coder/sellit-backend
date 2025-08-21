import db from "../config/db.js";

// ✅ Insert a new motor ad
export const insertMotorAd = async (adData) => {
    const query = `
    INSERT INTO motors_ads (
      sub_category, ad_title, description, make, car_condition, year, fuel, transmission,
      body_type, color, number_of_seats, features, number_of_owners, car_documents,
      assembly, location, price, seller_name, seller_contact,
      image_urls, attachment_urls, identifier, thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
        adData.sub_category,
        adData.ad_title,
        adData.description,
        adData.make,
        adData.car_condition,
        adData.year,
        adData.fuel,
        adData.transmission,
        adData.body_type,
        adData.color,
        adData.number_of_seats,
        JSON.stringify(adData.features || []), // ✅ Save as JSON string
        adData.number_of_owners,
        adData.car_documents,
        adData.assembly,
        adData.location,
        adData.price,
        adData.seller_name,
        adData.seller_contact,
        JSON.stringify(adData.image_urls || []),
        JSON.stringify(adData.attachment_urls || []),
        adData.identifier,
        adData.thumbnail_url
    ];

    const [result] = await db.query(query, values);
    return { id: result.insertId, ...adData };
};

// ✅ Fetch all motor ads
export const getAllMotorAds = async () => {
    const [rows] = await db.query(`SELECT * FROM motors_ads ORDER BY created_at DESC`);
    return rows;
};

// ✅ Fetch single motor ad
export const getMotorAdById = async (id) => {
    const [rows] = await db.query(`SELECT * FROM motors_ads WHERE id = ?`, [id]);
    return rows[0];
};
