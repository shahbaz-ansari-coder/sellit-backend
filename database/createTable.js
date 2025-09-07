import db from '../config/db.js';

const createUsersTable = async (cb) => {
  try {
    // Step 1: Ensure 'users' table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY
      );
    `);

    // Step 2: Ensure required columns exist and are correct
    const requiredColumns = [
      { name: 'username', type: "VARCHAR(100) NOT NULL UNIQUE" },
      { name: 'identifier', type: "VARCHAR(100) NOT NULL UNIQUE" },
      { name: 'password', type: "VARCHAR(255) NOT NULL" },
      {
        name: 'role',
        type: "ENUM('user', 'admin', 'team_member') DEFAULT 'user'",
        expectedType: "enum('user','admin','team_member')"
      },
      { name: 'state', type: "VARCHAR(100) DEFAULT NULL" },
      { name: 'isActive', type: "BOOLEAN DEFAULT FALSE" },
      { name: 'isBlocked', type: "BOOLEAN DEFAULT FALSE" },
      { name: 'created_at', type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" }
    ];

    for (const col of requiredColumns) {
      const [result] = await db.query(
        `SELECT COLUMN_TYPE
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'users'
           AND COLUMN_NAME = ?`,
        [col.name]
      );

      if (result.length === 0) {
        // Column doesn't exist → add it
        await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Added column '${col.name}' to users table.`);
      } else if (col.expectedType && result[0].COLUMN_TYPE !== col.expectedType) {
        // Column exists but ENUM is incorrect → update it
        await db.query(`ALTER TABLE users MODIFY COLUMN ${col.name} ${col.type}`);
        console.log(`🔄 Updated column '${col.name}' type to match expected ENUM.`);
      }
    }

    // Step 2.1: Remove unwanted columns if they exist
    const unwantedColumns = ['name', 'email'];
    for (const col of unwantedColumns) {
      const [result] = await db.query(
        `SELECT COUNT(*) AS cnt
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'users'
           AND COLUMN_NAME = ?`,
        [col]
      );

      if (result[0].cnt > 0) {
        await db.query(`ALTER TABLE users DROP COLUMN ${col}`);
        console.log(`🗑️ Dropped unwanted column '${col}' from users table.`);
      }
    }

    // Step 3: Create 'otps' table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        identifier VARCHAR(100) NOT NULL UNIQUE,
        otp CHAR(64) NOT NULL,
        expiresAt BIGINT NOT NULL
      );
    `);
    // Step 4: Create 'mobile_ads' table if not exists
    await db.query(`
  CREATE TABLE IF NOT EXISTS mobile_ads(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_category VARCHAR(100),
    ad_title VARCHAR(255),
    description TEXT,
    brand VARCHAR(100),
    phone_condition VARCHAR(50),
    location VARCHAR(100),
    price DECIMAL(10, 2),
    seller_name VARCHAR(100),
    seller_contact VARCHAR(20),
    image_urls JSON,        -- ✅ Cloudinary image URLs (array)
    attachment_urls JSON,   -- ✅ Cloudinary doc URLs (array)
    identifier VARCHAR(255), -- ✅ Email/identifier of the ad author
    thumbnail_url VARCHAR(500), -- ✅ Thumbnail image URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.query(`
  CREATE TABLE IF NOT EXISTS motors_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_category VARCHAR(100),
    ad_title VARCHAR(255),
    description TEXT,
    make VARCHAR(100),      
    car_condition VARCHAR(50),     
    year YEAR,                 
    fuel VARCHAR(50),         
    transmission VARCHAR(50),      
    body_type VARCHAR(100),         
    color VARCHAR(50),           
    number_of_seats INT,            
    features JSON,                
    number_of_owners INT,        
    car_documents VARCHAR(100),     
    assembly VARCHAR(50),         
    location VARCHAR(100),      
    price DECIMAL(12, 2),       
    seller_name VARCHAR(100),     
    seller_contact VARCHAR(20),   
    identifier VARCHAR(255),   
    image_urls JSON,               
    attachment_urls JSON,           
    thumbnail_url VARCHAR(500),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.query(`
  CREATE TABLE IF NOT EXISTS property_ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sub_category VARCHAR(255),
  ad_title VARCHAR(255),
  description TEXT,
  type VARCHAR(255),

  electricity_connection TINYINT(1) DEFAULT 0,
  gas_connection TINYINT(1) DEFAULT 0,
  water_supply TINYINT(1) DEFAULT 0,
  sewerage_system TINYINT(1) DEFAULT 0,
  road_access TINYINT(1) DEFAULT 0,
  boundary_wall TINYINT(1) DEFAULT 0,
  corner_plot TINYINT(1) DEFAULT 0,
  park_facing TINYINT(1) DEFAULT 0,

  area_unit VARCHAR(50),
  area DECIMAL(10,2),
  location VARCHAR(255),
  price DECIMAL(15,2),

  seller_name VARCHAR(255),
  seller_contact VARCHAR(50),
  image_urls JSON,
  attachment_urls JSON,
  identifier VARCHAR(255),
  thumbnail_url VARCHAR(500),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`);

    await db.query(`
CREATE TABLE IF NOT EXISTS job_ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  sub_category VARCHAR(255),
  job_category VARCHAR(255),
  job_title VARCHAR(255),
  description TEXT,
  
  hiring_type ENUM('Individual', 'Company', 'Consultant'),
  company_name VARCHAR(255),
  
  type_of_ad ENUM('Job Wanted', 'Job Offered'),
  salary_from DECIMAL(15,2),
  salary_to DECIMAL(15,2),
  career_level VARCHAR(100),
  salary_period VARCHAR(100),
  position_type VARCHAR(100),
  location VARCHAR(255),

  seller_name VARCHAR(255),    
  seller_contact VARCHAR(50),

  image_urls JSON,
  attachment_urls JSON,
  identifier VARCHAR(255),
  thumbnail_url VARCHAR(500),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`);

    await db.query(`
  CREATE TABLE IF NOT EXISTS kids_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_category VARCHAR(100),         
    ad_title VARCHAR(255),          
    description TEXT,              
    item_type VARCHAR(100),          
    age_group VARCHAR(100),      
    brand VARCHAR(100),            
    item_condition VARCHAR(50),  
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

    await db.query(`
  CREATE TABLE IF NOT EXISTS property_rent_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_category VARCHAR(255),          
    property_type VARCHAR(255), 
    ad_title VARCHAR(255),
    description TEXT,
    furnished TINYINT(1) DEFAULT 0, 

    bedrooms INT,
    bathrooms INT,
    storeys INT,
    construction_state VARCHAR(100), 

    features JSON,             

    area_unit VARCHAR(50),        
    area DECIMAL(10,2),           
    location VARCHAR(255),
    rent_price DECIMAL(15,2),   

    seller_name VARCHAR(255),
    seller_contact VARCHAR(50),
    image_urls JSON,
    attachment_urls JSON,
    identifier VARCHAR(255),      
    thumbnail_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.query(`
CREATE TABLE IF NOT EXISTS bike_ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sub_category VARCHAR(100),
  ad_title VARCHAR(255),
  description TEXT,
  make VARCHAR(100),
  model VARCHAR(100),
  year YEAR,
  engine_type VARCHAR(100),
  engine_capacity VARCHAR(100),
  kms_driven VARCHAR(100),
  ignition_type VARCHAR(100),
  origin VARCHAR(100),
  bike_condition VARCHAR(100), 
  registration_city VARCHAR(100),
  features JSON,
  location VARCHAR(255),
  price DECIMAL(10,2),
  seller_name VARCHAR(100),
  seller_contact VARCHAR(50),
  image_urls JSON,
  attachment_urls JSON,
  identifier VARCHAR(255),
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`);

    await db.query(`
      CREATE TABLE IF NOT EXISTS electronics_ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sub_category VARCHAR(100),
  ad_title VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  brand VARCHAR(100),
  model VARCHAR(100),
  item_condition VARCHAR(100),
  warranty VARCHAR(100),
  features JSON,
  location VARCHAR(255),
  price DECIMAL(10,2),
  seller_name VARCHAR(100),
  seller_contact VARCHAR(50),
  image_urls JSON,
  attachment_urls JSON,
  identifier VARCHAR(255),
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

    await db.query(`
      CREATE TABLE IF NOT EXISTS animal_ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sub_category VARCHAR(100),
  ad_title VARCHAR(255),
  description TEXT,
  type_of_animal VARCHAR(100),
  breed VARCHAR(100),
  sex VARCHAR(50),
  age VARCHAR(50),
  color VARCHAR(50),
  vaccination_status VARCHAR(100),
  features JSON,
  location VARCHAR(255),
  price DECIMAL(10,2),
  seller_name VARCHAR(100),
  seller_contact VARCHAR(50),
  image_urls JSON,
  attachment_urls JSON,
  identifier VARCHAR(255),
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

      await db.query(`
        CREATE TABLE IF NOT EXISTS fashion_ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sub_category VARCHAR(100),
  ad_title VARCHAR(255),
  description TEXT,
  sex_gender VARCHAR(50),
  brand VARCHAR(100),
  size VARCHAR(50),
  color VARCHAR(50),
  material VARCHAR(100),
  item_condition VARCHAR(100),
  type VARCHAR(100),
  features JSON,
  location VARCHAR(255),
  price DECIMAL(10,2),
  seller_name VARCHAR(100),
  seller_contact VARCHAR(50),
  image_urls JSON,
  attachment_urls JSON,
  identifier VARCHAR(255),
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

      await db.query(`
    CREATE TABLE IF NOT EXISTS books_sports_ads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sub_category VARCHAR(100),
      ad_title VARCHAR(255),
      description TEXT,
      item_type VARCHAR(100),
      genre_category VARCHAR(100),
      author_artist_brand VARCHAR(100),
      ad_condition VARCHAR(100),
      language VARCHAR(100),
      format VARCHAR(100),
      features JSON,
      location VARCHAR(255),
      price DECIMAL(10,2),
      seller_name VARCHAR(100),
      seller_contact VARCHAR(50),
      image_urls JSON,
      attachment_urls JSON,
      identifier VARCHAR(255),
      thumbnail_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
        CREATE TABLE IF NOT EXISTS furniture_ads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sub_category VARCHAR(100),
      ad_title VARCHAR(255),
      description TEXT,
      item_type VARCHAR(100),
      material VARCHAR(100),
      brand VARCHAR(100),
      furniture_condition VARCHAR(100),
      dimensions VARCHAR(100),
      features JSON,
      location VARCHAR(255),
      price DECIMAL(10,2),
      seller_name VARCHAR(100),
      seller_contact VARCHAR(50),
      image_urls JSON,
      attachment_urls JSON,
      identifier VARCHAR(255),
      thumbnail_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    console.log("✅ Tables created or updated successfully.");
    cb();
  } catch (err) {
    console.error("❌ Table setup failed:", err.message);
    cb(err);
  }
};

export default createUsersTable;
