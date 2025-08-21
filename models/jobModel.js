import db from "../config/db.js";

// ✅ Insert Job Ad
export const insertJobAd = async (jobAdData) => {
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
        seller_contact,
        image_urls,
        attachment_urls,
        identifier,
        thumbnail_url
    } = jobAdData;

    const query = `
    INSERT INTO job_ads (
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
      image_urls,
      attachment_urls,
      identifier,
      thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
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
        JSON.stringify(image_urls),
        JSON.stringify(attachment_urls),
        identifier,
        thumbnail_url
    ];

    const [result] = await db.query(query, values);
    return { id: result.insertId, ...jobAdData };
};

// ✅ Get All Job Ads
export const getAllJobAds = async () => {
    const [rows] = await db.query("SELECT * FROM job_ads ORDER BY created_at DESC");
    return rows;
};
