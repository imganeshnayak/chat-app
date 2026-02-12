import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

const prisma = new PrismaClient();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/messages/chats/list - Get chat list for current user (must be before /:chatId)
router.get('/chats/list', auth, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: { OR: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
            orderBy: { createdAt: 'desc' },
            include: { sender: { select: { id: true, displayName: true, avatarUrl: true, username: true } }, receiver: { select: { id: true, displayName: true, avatarUrl: true, username: true } } },
        });

        // Group by chatId and get latest message per chat
        const chatMap = new Map();
        for (const msg of messages) {
            if (!chatMap.has(msg.chatId)) {
                const otherUser = msg.senderId === req.user.id ? msg.receiver : msg.sender;
                const unreadCount = await prisma.message.count({
                    where: { chatId: msg.chatId, read: false, receiverId: req.user.id },
                });
                chatMap.set(msg.chatId, {
                    chat_id: msg.chatId,
                    last_message: msg.content,
                    last_message_time: msg.createdAt,
                    user_id: otherUser.id,
                    display_name: otherUser.displayName,
                    avatar_url: otherUser.avatarUrl,
                    username: otherUser.username,
                    unread_count: unreadCount,
                });
            }
        }

        res.json(Array.from(chatMap.values()));
    } catch (err) {
        console.error('Get chats error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// GET /api/messages/:chatId - Get messages for a chat
router.get('/:chatId', auth, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: { chatId: req.params.chatId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { displayName: true, avatarUrl: true, username: true } },
            },
        });

        const result = messages.map(m => ({
            ...m,
            sender_name: m.sender.displayName,
            sender_avatar: m.sender.avatarUrl,
            sender_username: m.sender.username,
            sender: undefined,
        }));

        res.json(result);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// POST /api/messages - Send a message
router.post('/', auth, async (req, res) => {
    try {
        const { receiver_id, chat_id, content, message_type } = req.body;

        const message = await prisma.message.create({
            data: { senderId: req.user.id, receiverId: receiver_id, chatId: chat_id, content, messageType: message_type || 'text' },
            include: { sender: { select: { displayName: true, avatarUrl: true, username: true } } },
        });

        await prisma.activityLog.create({ data: { userId: req.user.id, action: 'Sent message' } });

        res.status(201).json({
            ...message,
            sender_name: message.sender.displayName,
            sender_avatar: message.sender.avatarUrl,
            sender_username: message.sender.username,
        });
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// POST /api/messages/upload - Send message with file attachment via Cloudinary
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        const { receiver_id, chat_id, content } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'vesper/attachments', resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const message = await prisma.message.create({
            data: {
                senderId: req.user.id,
                receiverId: parseInt(receiver_id),
                chatId: chat_id,
                content: content || 'File shared',
                messageType: 'file',
                attachmentUrl: uploadResult.secure_url,
                attachmentName: req.file.originalname,
            },
        });

        await prisma.activityLog.create({ data: { userId: req.user.id, action: 'File uploaded' } });

        res.status(201).json(message);
    } catch (err) {
        console.error('File upload error:', err);
        res.status(500).json({ error: 'Upload failed.' });
    }
});

export default router;
