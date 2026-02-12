import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, adminOnly } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const [activeUsers, totalMessages, recentSessions, flagged] = await Promise.all([
            prisma.user.count({ where: { status: 'active' } }),
            prisma.message.count(),
            prisma.activityLog.count({
                where: { action: 'Logged in', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            }),
            prisma.activityLog.count({ where: { status: 'flagged' } }),
        ]);

        res.json({
            revenue: { value: '$124,500', change: '+12.5%' },
            activeUsers: { value: activeUsers, change: '+8.2%' },
            telegramSessions: { value: recentSessions, change: '+15.3%' },
            flaggedMessages: { value: flagged, change: `+${flagged}` },
            totalMessages,
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// GET /api/admin/activity - Recent platform activity
router.get('/activity', auth, adminOnly, async (req, res) => {
    try {
        const activities = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { user: { select: { displayName: true, username: true, avatarUrl: true } } },
        });

        const result = activities.map(a => ({
            id: a.id,
            user: a.user.displayName,
            username: `@${a.user.username}`,
            avatar_url: a.user.avatarUrl,
            action: a.action,
            time: getRelativeTime(a.createdAt),
            status: a.status,
        }));

        res.json(result);
    } catch (err) {
        console.error('Activity error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// GET /api/admin/stream - Live event stream
router.get('/stream', auth, adminOnly, async (req, res) => {
    try {
        const events = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { user: { select: { displayName: true } } },
        });

        const result = events.map(e => ({
            time: new Date(e.createdAt).toLocaleTimeString('en-US', { hour12: false }),
            event: `${e.user.displayName}: ${e.action}`,
        }));

        res.json(result);
    } catch (err) {
        console.error('Stream error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

function getRelativeTime(date) {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default router;
