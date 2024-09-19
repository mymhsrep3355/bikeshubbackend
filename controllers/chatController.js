const Chat = require('../models/chatModel');
const User = require('../models/userModel');

exports.joinChat = async (req, res) => {
  const { buyerId, sellerId } = req.body;

  try {
    let chat = await Chat.findOne({
      $or: [
        { buyer: buyerId, seller: sellerId },
        { buyer: sellerId, seller: buyerId },
      ],
    });

    if (!chat) {
      chat = new Chat({
        buyer: buyerId,
        seller: sellerId,
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json({ chatId: chat._id, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join chat', error });
  }
};


exports.sendMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = {
      sender: senderId,
      content,
      timestamp: Date.now(),
    };

    chat.messages.push(message);
    chat.lastMessageAt = Date.now();
    await chat.save();

    res.status(200).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

exports.getChats = async (req, res) => {
  const userId = req.user._id;

  try {
    const chats = await Chat.find({
      $or: [{ buyer: userId }, { seller: userId }],
    }).populate('buyer seller', 'username email');

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chats', error });
  }
};