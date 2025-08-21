import db from '../config/db.js';

export const insertMobileAd = async (adData) => {
  const {
    sub_category, ad_title, description,
    brand, phone_condition, location,
    price, seller_name, seller_contact,
    image_urls, attachment_urls, identifier,
    thumbnail_url
  } = adData;

  const [result] = await db.query(`
        INSERT INTO mobile_ads (
          sub_category, ad_title, description, brand, phone_condition,
          location, price, seller_name, seller_contact,
          image_urls, attachment_urls, identifier, thumbnail_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
    sub_category, ad_title, description, brand, phone_condition,
    location, price, seller_name, seller_contact,
    JSON.stringify(image_urls), JSON.stringify(attachment_urls),
    identifier, thumbnail_url
  ]);

  return result.insertId;
};

//  Find user by ID
export const findUserById = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0];
};
