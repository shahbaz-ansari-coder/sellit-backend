import db from '../config/db.js';

const createUsersTable = async (cb) => {
  try {
    // Step 1: Ensure 'users' table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY
      );
    `);

    // Step 2: Ensure required columns exist in 'users'
    const requiredColumns = [
      { name: 'username', type: "VARCHAR(100) NOT NULL UNIQUE" },
      { name: 'identifier', type: "VARCHAR(100) NOT NULL UNIQUE" },
      { name: 'password', type: "VARCHAR(255) NOT NULL" },
      { name: 'role', type: "ENUM('user', 'admin') DEFAULT 'user'" },
      { name: 'isActive', type: "BOOLEAN DEFAULT FALSE" },
      { name: 'isBlocked', type: "BOOLEAN DEFAULT FALSE" },
      { name: 'created_at', type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" }
    ];

    for (const col of requiredColumns) {
      const [result] = await db.query(
        `SELECT COUNT(*) AS cnt
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'users'
           AND COLUMN_NAME = ?`,
        [col.name]
      );

      if (result[0].cnt === 0) {
        await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Added column '${col.name}' to users table.`);
      }
    }

    // Step 3: Create OTPs table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        identifier VARCHAR(100) NOT NULL UNIQUE,
        otp CHAR(64) NOT NULL,
        expiresAt BIGINT NOT NULL
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
