// import { createUser, findUserByEmail } from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { activateUser, findUserByEmail , createUser, findUserByIdentifier, findUserByUsername, saveOrUpdateOtp, findOtpByIdentifier, deleteOtp, updatePassword, addUser } from '../models/authModel.js';

const JWT_SECRET = '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

 const randomPassword = () => {
    return Math.random().toString(36).slice(-10); // e.g. "g8f3sk4b1c"
};

 const generateUniqueUsername = async (baseName) => {
    const suffix = Math.floor(Math.random() * 10000);
    return `${baseName.toLowerCase().replace(/\s/g, '')}_${suffix}`;
};

export const signup = async (req, res) => {
    const { username, identifier, password } = req.body;

    if (!username || !identifier || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const identifierExists = await findUserByIdentifier(identifier);
        if (identifierExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const usernameExists = await findUserByUsername(username);
        if (usernameExists) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await createUser(username, identifier, hashedPassword);

        const token = jwt.sign(
            { id: result.insertId },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username,
                identifier
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Identifier and password are required' });
    }

    try {
        const user = await findUserByIdentifier(identifier);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id || user.id }, // support both Mongo-style and SQL ids
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id || user.id,
                username: user.username,
                identifier: user.identifier,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// Simple 6-digit OTP generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({ message: "Identifier is required" });
        }

        if (!identifier.includes('@')) {
            return res.status(400).json({ message: "Mobile OTP service is not available yet." });
        }

        const otp = generateOTP();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        const expiry = Date.now() + 1 * 60 * 1000; // 1 minute from now

        await saveOrUpdateOtp(identifier, hashedOtp, expiry);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'shahbazansari8199@gmail.com',
                pass: 'xuzp zzno lxpr ocip',
            },
        });

        await transporter.sendMail({
            from: `"Sellit Pakistan" <shahbazansari8199@gmail.com>`,
            to: identifier,
            subject: "Verify your account",
            text: `Your OTP is ${otp}`,
        });

        res.status(200).json({ message: "OTP sent to your email address." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        if (!identifier || !otp) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const record = await findOtpByIdentifier(identifier);
        if (!record) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        const hashed = crypto.createHash('sha256').update(otp).digest('hex');
        const isValid = record.otp === hashed && Date.now() < Number(record.expiresAt);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        await deleteOtp(identifier); // delete OTP after verification
        await activateUser(identifier); // ✅ update user status to active

        res.status(200).json({ message: 'OTP verified and account activated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { identifier, newPassword } = req.body;

        if (!identifier || !newPassword)
            return res.status(400).json({ message: 'Identifier and new password are required' });

        // Check if user exists
        const user = await findUserByIdentifier(identifier);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        await updatePassword(identifier, hashedPassword);

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();

        let user = await findUserByEmail(email);

        if (!user) {
            const username = await generateUniqueUsername(name);
            const plainPassword = randomPassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const result = await addUser(username, email, hashedPassword, true); // isActive true
            user = { id: result.insertId, username, identifier: email };
        }

        const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token: jwtToken,
            user: {
                id: user.id,
                username: user.username,
                identifier: user.identifier,
            }
        });

    } catch (err) {
        console.error('Google login error:', err.message);
        res.status(401).json({ message: 'Invalid Google token' });
    }
};