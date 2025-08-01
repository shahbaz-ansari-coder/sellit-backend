import db from '../config/db.js';

export const createUser = async (username, identifier, hashedPassword) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, identifier, password) VALUES (?, ?, ?)`,
        [username, identifier, hashedPassword]
    );
    return result;
};

// Find user by identifier (email or phone)
export const findUserByIdentifier = async (identifier) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE identifier = ? LIMIT 1`,
        [identifier]
    );
    return rows[0];
};

// Find user by username
export const findUserByUsername = async (username) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE username = ? LIMIT 1`,
        [username]
    );
    return rows[0];
};


// 🔄 Save or update OTP for identifier (email or phone)
export const saveOrUpdateOtp = async (identifier, hashedOtp, expiresAt) => {
    const [existing] = await db.execute(
        `SELECT id FROM otps WHERE identifier = ? LIMIT 1`,
        [identifier]
    );

    if (existing.length > 0) {
        // Update existing OTP
        return db.execute(
            `UPDATE otps SET otp = ?, expiresAt = ? WHERE identifier = ?`,
            [hashedOtp, expiresAt, identifier]
        );
    } else {
        // Insert new OTP
        return db.execute(
            `INSERT INTO otps (identifier, otp, expiresAt) VALUES (?, ?, ?)`,
            [identifier, hashedOtp, expiresAt]
        );
    }
};

// 🔍 Find OTP by identifier (for verification)
export const findOtpByIdentifier = async (identifier) => {
    const [rows] = await db.execute(
        `SELECT * FROM otps WHERE identifier = ? LIMIT 1`,
        [identifier]
    );
    return rows[0]; // return object or undefined
};

// ❌ Delete OTP after verification or expiration
export const deleteOtp = async (identifier) => {
    return db.execute(`DELETE FROM otps WHERE identifier = ?`, [identifier]);
};


// Update user's password
export const updatePassword = async (identifier, hashedPassword) => {
    return db.execute(
        `UPDATE users SET password = ? WHERE identifier = ?`,
        [hashedPassword, identifier]
    );
};

export const activateUser = async (identifier) => {
    const [result] = await db.execute(
        'UPDATE users SET isActive = ? WHERE identifier = ?',
        [true, identifier]
    );
    return result;
};

export const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE identifier = ? LIMIT 1`, [email]
    );
    return rows[0];
};

export const addUser = async (username, email, hashedPassword, isActive = false) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, identifier, password, isActive) VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, isActive]
    );
    return result;
};