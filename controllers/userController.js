import bcrypt from 'bcryptjs';
import { addUserToDB, findUserByEmailOrUsername, updateUserById , findUserById, getAllUsers, deleteUserById, blockUserById, unblockUserById } from '../models/userModel.js';

//  Get all users
export const getUsers = async (req, res) => {
    const { id } = req.params;

    try {
        const adminUser = await findUserById(id);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        const users = await getAllUsers();
        res.status(200).json(users);

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

//  Get Single users
export const getSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude password before sending response
        const { password, ...safeUser } = user;

        res.status(200).json(safeUser);

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await deleteUserById(id);

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Block user
export const blockUser = async (req, res) => {
    const { id: adminId } = req.params; // Admin ID from URL
    const { userId } = req.body;        // User ID to block from body

    try {
        const admin = await findUserById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can block users' });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admin users cannot be blocked' });
        }

        if (user.isBlocked) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        await blockUserById(userId);

        res.status(200).json({
            message: 'User has been blocked successfully',
            user: {
                id: user.id,
                username: user.username,
                identifier: user.identifier,
                isBlocked: true
            }
        });

    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Unblock user
export const unblockUser = async (req, res) => {
    const { id: adminId } = req.params;
    const { userId } = req.body;

    try {
        const admin = await findUserById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can unblock users' });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isBlocked) {
            return res.status(400).json({ message: 'User is already unblocked' });
        }

        await unblockUserById(userId);

        res.status(200).json({
            message: 'User has been unblocked successfully',
            user: {
                id: user.id,
                username: user.username,
                identifier: user.identifier,
                isBlocked: false
            }
        });

    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add user
export const addUserByAdmin = async (req, res) => {
    const { username, identifier, password, role = 'user', isActive = false } = req.body;

    if (!username || !identifier || !password)
        return res.status(400).json({ message: 'Username, email, and password are required' });

    try {
        const existingUser = await findUserByEmailOrUsername(identifier, username);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await addUserToDB(username, identifier, hashedPassword, role, isActive);

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, identifier, password, role, isActive } = req.body;

    try {
        const user = await findUserById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newUsername = username || user.username;
        const newIdentifier = identifier || user.identifier;
        const newRole = role || user.role;
        const newIsActive = isActive !== undefined ? isActive : user.isActive;
        const newPassword = password ? await bcrypt.hash(password, 10) : user.password;

        await updateUserById(id, newUsername, newIdentifier, newPassword, newRole, newIsActive);

        res.status(200).json({ message: 'User updated successfully' });

    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: 'Server error' });
    }
};