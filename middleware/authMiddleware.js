// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2';

export const verifyUserToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};
