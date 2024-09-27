const Chat = require('../models/chatModel');
const User = require('../models/userModel');


exports.getAllMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate('messages.sender', 'username email');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({ message: 'Messages retrieved successfully', messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages', error });
  }
};


// exports.sendMessage = async (req, res) => {
//   const { chatId, senderId, content } = req.body;

//   try {
//     const chat = await Chat.findById(chatId);

//     if (!chat) {
//       console.log('Chat not found for chatId:', chatId);
//       return res.status(404).json({ message: 'Chat not found' });
//     }


//     let receiverId;
//     if (senderId.toString() === chat.buyer.toString()) {
//       receiverId = chat.seller;
//     } else if (senderId.toString() === chat.seller.toString()) {
//       receiverId = chat.buyer;
//     } else {
//       console.log('Invalid sender ID:', senderId);
//       return res.status(400).json({ message: 'Invalid sender ID' });
//     }

//     console.log('Sender ID:', senderId);
//     console.log('Receiver ID:', receiverId);

  
//     if (!receiverId) {
//       console.error('Receiver ID is undefined or null');
//       return res.status(400).json({ message: 'Receiver ID is required' });
//     }

  
//     const message = {
//       sender: senderId,
//       receiver: receiverId,
//       content,
//       timestamp: Date.now(),
//     };

//     console.log('Message to be pushed:', message);

//     // Add the message to the chat
//     chat.messages.push(message);
//     chat.lastMessageAt = Date.now();
//     await chat.save();

//     res.status(200).json({ message: 'Message sent successfully', chat });
//   } catch (error) {
//     console.error('Error in sendMessage:', error);
//     res.status(500).json({ message: 'Failed to send message', error });
//   }
// };



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
