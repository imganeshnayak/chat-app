import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Development Bypass
    if (!token && process.env.NODE_ENV !== 'production') {
        req.user = { id: 1, username: 'dev_user', role: 'admin' };
        return next();
    }

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Fallback for dev if token is invalid
        if (process.env.NODE_ENV !== 'production') {
            req.user = { id: 1, username: 'dev_user', role: 'admin' };
            return next();
        }
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
};

export { auth, adminOnly };
