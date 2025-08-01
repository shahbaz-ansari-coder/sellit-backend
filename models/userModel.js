import db from '../config/db.js';

//  Find user by ID
export const findUserById = async (id) => {
    const [rows] = await db.execute(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
    return rows[0];
};

//  Get all users
export const getAllUsers = async () => {
    const [rows] = await db.execute(`SELECT id, username, identifier, role, isActive, isBlocked, created_at FROM users`);
    return rows;
};

// Delete user
export const deleteUserById = async (id) => {
    return db.execute(`DELETE FROM users WHERE id = ?`, [id]);
};

// Block user
export const blockUserById = async (id) => {
    return db.execute(`UPDATE users SET isBlocked = true WHERE id = ?`, [id]);
};

// Unblock user
export const unblockUserById = async (id) => {
    return db.execute(`UPDATE users SET isBlocked = false WHERE id = ?`, [id]);
};

// Find  user by email
export const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE identifier = ? LIMIT 1`, [email]
    );
    return rows[0];
};

// Add user 
export const addUser = async (username, email, hashedPassword, isActive = false) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, identifier, password, isActive) VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, isActive]
    );
    return result;
};

export const findUserByEmailOrUsername = async (identifier, username) => {
    const [rows] = await db.execute(
        `SELECT * FROM users WHERE identifier = ? OR username = ? LIMIT 1`,
        [identifier, username]
    );
    return rows[0];
};

export const addUserToDB = async (username, identifier, password, role, isActive) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, identifier, password, role, isActive) VALUES (?, ?, ?, ?, ?)`,
        [username, identifier, password, role, isActive]
    );
    return result;
};

export const updateUserById = async (id, username, identifier, password, role, isActive) => {
    return db.execute(
        `UPDATE users SET username = ?, identifier = ?, password = ?, role = ?, isActive = ? WHERE id = ?`,
        [username, identifier, password, role, isActive, id]
    );
};