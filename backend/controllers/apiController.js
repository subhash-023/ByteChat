const prisma = require('../config/prismaConfig');

exports.getChats = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { userId },
                },
            },
            include: {
                participants: {
                    select: {
                        user: { select: { id: true, username: true } },
                    },
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json(chats);
    } catch (error) {
        console.error('error')
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.sendMessage = async (req, res) => {
    const { text, senderId, chatId } = req.body;

    if (!text || !senderId || !chatId) {
        return res.status(400).json({ error: 'Text, senderId and chatId are required' });
    }
    try {
        const newMsg = await prisma.message.create({
            data: {
                content: text,
                senderId: senderId,
                chatId: chatId,
            },
        })
        res.status(201).json(newMsg)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.createNewChat = async (req, res) => {
    const { userId, recipient } = req.body;
    if (!userId || !recipient) {
        return res.status(400).json({ error: "User's ID, and recipient's ID is required." });
    }
    try {
        const recipientUser = await prisma.user.findUnique({
            where: { username: recipient },
        });
        if (!recipientUser) {
            return res.status(400).json({ error: `User '${recipient}' does not exist.` });
        }
        const chatExists = await prisma.chat.findFirst({
            where: {
                isGroup: false,
                participants: {
                    every: {
                        userId: { in: [userId, recipientUser.id] },
                    },
                },
            },
            include: {
                participants: true,
            },
        });

        if (chatExists && chatExists.participants.length === 2) {
            return res.status(200).json({ message: 'Chat already exists.', chat: chatExists });
        }

        const newChat = await prisma.chat.create({
            data: {
                isGroup: false,
                participants: {
                    create: [
                        { user: { connect: { id: userId } } },
                        { user: { connect: { id: recipientUser.id } } },
                    ],
                },
            },
            include: {
                participants: true,
            },
        });
        res.status(201).json({ message: 'Chat created.', chat: newChat })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.deleteChat = async (req, res) => {
    const { chatId } = req.body;
    if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required.' });
    }
    try {
        const deletedChat = await prisma.chat.delete({
            where: { id: chatId },
        });
        res.status(200).json({ message: 'Chat deleted successfully' })
    } catch (error) {
        console.error(error);
        res.json({ error: 'Internal server error' });
    }
}