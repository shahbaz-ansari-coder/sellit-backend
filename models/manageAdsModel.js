import db from "../config/db.js";

export const findUserIdentifier = async (userId) => {
    const [rows] = await db.query(
        "SELECT identifier FROM users WHERE id = ?",
        [userId]
    );
    return rows.length > 0 ? rows[0].identifier : null;
};

export const deleteUserAdModel = async (table, id) => {
    const [result] = await db.query(
        `DELETE FROM ${table} WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
};

export const findUserAds = async (identifier) => {
    const queries = [
        db.query("SELECT *, 'mobile_ads' AS source FROM mobile_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'motors_ads' AS source FROM motors_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'property_ads' AS source FROM property_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'kids_ads' AS source FROM kids_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'property_rent_ads' AS source FROM property_rent_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'bike_ads' AS source FROM bike_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'electronics_ads' AS source FROM electronics_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'animal_ads' AS source FROM animal_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'fashion_ads' AS source FROM fashion_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'books_sports_ads' AS source FROM books_sports_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'furniture_ads' AS source FROM furniture_ads WHERE identifier = ?", [identifier]),
    ];

    const results = await Promise.all(queries);
    const ads = results.flatMap(([rows]) => rows);

    return ads;
};
