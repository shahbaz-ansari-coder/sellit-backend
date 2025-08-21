import db from "../config/db.js";

// ✅ Get user identifier (email saved as identifier)
export const findUserIdentifier = async (userId) => {
    const [rows] = await db.query("SELECT identifier FROM users WHERE id = ?", [userId]);
    return rows.length > 0 ? rows[0].identifier : null;  // ✅ fix here
};

// ✅ Get all ads posted by identifier from different tables
export const findUserAds = async (identifier) => {
    const queries = [
        db.query("SELECT *, 'mobile_ads' AS source FROM mobile_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'motors_ads' AS source FROM motors_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'property_ads' AS source FROM property_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'job_ads' AS source FROM job_ads WHERE identifier = ?", [identifier]),
        db.query("SELECT *, 'kids_ads' AS source FROM kids_ads WHERE identifier = ?", [identifier])
    ];

    const results = await Promise.all(queries);

    // ✅ results = [[rows, fields], [rows, fields], ...] → sirf rows chahiye
    const ads = results.flatMap(([rows]) => rows);

    return ads;
};
