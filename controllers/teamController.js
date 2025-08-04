import bcrypt from 'bcryptjs';
import { updateTeamMember, findUserByEmailOrUsername, addTeamMember, getTeamMembersOnly , findUserById } from "../models/teamModel.js";

export const addTeamMemberByAdmin = async (req, res) => {
    const {
        username,
        identifier,
        password,
        state,
        role = 'team_member', // fixed here
        isActive = true
    } = req.body;

    // ✅ Validation
    if (!username || !identifier || !password || !state) {
        return res.status(400).json({ message: 'Username, email, password, and state are required' });
    }

    try {
        // ✅ Check for existing user
        const existingUser = await findUserByEmailOrUsername(identifier, username);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Add team member to DB
        const result = await addTeamMember(username, identifier, hashedPassword, role, isActive, state);

        res.status(201).json({
            message: 'Team member created successfully',
            userId: result.insertId
        });

    } catch (err) {
        console.error("❌ Error adding team member:", err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTeamMembers = async (req, res) => {
    const { id } = req.params;

    try {
        const adminUser = await findUserById(id);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        const teamMembers = await getTeamMembersOnly();
        res.status(200).json({
            message: 'Team members fetched successfully',
            teamMembers
        });
    } catch (error) {
        console.error("❌ Error fetching team members:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const editTeamMemberByAdmin = async (req, res) => {
    const { id } = req.params;
    const {
        username,
        identifier,
        password,
        state,
        isActive,
        role
    } = req.body;

    try {
        // ✅ Check if user exists
        const existingUser = await findUserById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ✅ If password is provided, hash it
        let hashedPassword = existingUser.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // ✅ Update team member
        const result = await updateTeamMember(
            id,
            username || existingUser.username,
            identifier || existingUser.identifier,
            hashedPassword,
            role || existingUser.role,
            isActive !== undefined ? isActive : existingUser.isActive,
            state || existingUser.state
        );

        res.status(200).json({ message: 'Team member updated successfully' });

    } catch (error) {
        console.error("❌ Error updating team member:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};