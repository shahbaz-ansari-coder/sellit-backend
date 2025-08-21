import db from "../config/db.js";

// Create kids_ads table if it doesn’t exist
export const createKidsAdsTable = async () => {
    try {
        await db.query(`
      CREATE TABLE IF NOT EXISTS kids_ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sub_category VARCHAR(100),         
        ad_title VARCHAR(255),          
        description TEXT,              
        item_type VARCHAR(100),          
        age_group VARCHAR(100),      
        brand VARCHAR(100),            
        item_condition VARCHAR(50),     -- ✅ FIXED (renamed from "condition")
        features JSON,                    
        location VARCHAR(255),        
        price DECIMAL(12,2),             
        seller_name VARCHAR(100),        
        seller_contact VARCHAR(20),      
        image_urls JSON,                 
        attachment_urls JSON,            
        identifier VARCHAR(255),        
        thumbnail_url VARCHAR(500),    
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log("✅ kids_ads table created or already exists");
    } catch (error) {
        console.error("❌ Error creating kids_ads table:", error);
    }
};

// Insert new kids ad
export const insertKidsAd = async (adData) => {
    try {
        const {
            sub_category,
            ad_title,
            description,
            item_type,
            age_group,
            brand,
            item_condition,   // ✅ FIXED naming
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

        const [result] = await db.query(
            `
      INSERT INTO kids_ads 
        (sub_category, ad_title, description, item_type, age_group, brand, item_condition, features, location, price, seller_name, seller_contact, image_urls, attachment_urls, identifier, thumbnail_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
            [
                sub_category,
                ad_title,
                description,
                item_type,
                age_group,
                brand,
                item_condition,   // ✅ FIXED
                JSON.stringify(features || []),
                location,
                price,
                seller_name,
                seller_contact,
                JSON.stringify(image_urls || []),
                JSON.stringify(attachment_urls || []),
                identifier,
                thumbnail_url,
            ]
        );

        return result;
    } catch (error) {
        console.error("❌ Error inserting kids ad:", error);
        throw error;
    }
};

// Fetch all kids ads
export const getAllKidsAds = async () => {
    try {
        const [rows] = await db.query(`SELECT * FROM kids_ads ORDER BY created_at DESC`);
        return rows;
    } catch (error) {
        console.error("❌ Error fetching kids ads:", error);
        throw error;
    }
};

// Fetch single ad by ID
export const getKidsAdById = async (id) => {
    try {
        const [rows] = await db.query(`SELECT * FROM kids_ads WHERE id = ?`, [id]);
        return rows[0];
    } catch (error) {
        console.error("❌ Error fetching kids ad by ID:", error);
        throw error;
    }
};

// Delete ad
export const deleteKidsAd = async (id) => {
    try {
        const [result] = await db.query(`DELETE FROM kids_ads WHERE id = ?`, [id]);
        return result;
    } catch (error) {
        console.error("❌ Error deleting kids ad:", error);
        throw error;
    }
};
