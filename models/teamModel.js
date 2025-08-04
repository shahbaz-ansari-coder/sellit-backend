import db from '../config/db.js';

export const addTeamMember = async (username, identifier, hashedPassword, role, isActive, state) => {
    const [result] = await db.execute(
        `INSERT INTO users (username, identifier, password, role, isActive, state)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, identifier, hashedPassword, role, isActive, state]
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

export const getTeamMembersOnly = async () => {
    const [rows] = await db.execute(`
    SELECT id, username, identifier, role, isActive, isBlocked, state, created_at 
    FROM users 
    WHERE role = 'team_member'
  `);
    return rows;
};

export const findUserById = async (id) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
};

export const updateTeamMember = async (
    id,
    username,
    identifier,
    hashedPassword,
    role,
    isActive,
    state
) => {
    const [result] = await db.execute(
        `UPDATE users 
         SET username = ?, identifier = ?, password = ?, role = ?, isActive = ?, state = ?
         WHERE id = ?`,
        [username, identifier, hashedPassword, role, isActive, state, id]
    );
    return result;
};