import db from "../config/db.js";

export const insertPropertyAd = async (adData) => {
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
        seller_contact,
        image_urls,
        attachment_urls,
        identifier,
        thumbnail_url,
    } = adData;

    // ✅ Convert boolean to 0/1
    const boolToInt = (val) => (val ? 1 : 0);

    const [result] = await db.query(
        `INSERT INTO property_ads (
        sub_category, ad_title, description, type,
        electricity_connection, gas_connection, water_supply, sewerage_system,
        road_access, boundary_wall, corner_plot, park_facing,
        area_unit, area, location, price,
        seller_name, seller_contact, image_urls, attachment_urls,
        identifier, thumbnail_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            sub_category,
            ad_title,
            description,
            type,
            boolToInt(electricity_connection),
            boolToInt(gas_connection),
            boolToInt(water_supply),
            boolToInt(sewerage_system),
            boolToInt(road_access),
            boolToInt(boundary_wall),
            boolToInt(corner_plot),
            boolToInt(park_facing),
            area_unit,
            area,
            location,
            price,
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
