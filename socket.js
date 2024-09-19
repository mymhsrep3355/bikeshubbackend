// socket.js
const { Server } = require('socket.io');
const Chat = require('./models/chatModel');
const User = require('./models/userModel');

function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_chat', async ({ buyerId, sellerId }) => {
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

        const chatRoom = createChatRoom(chat.buyer, chat.seller);
        socket.join(chatRoom);
        socket.emit('chat_id', chat._id);
        socket.emit('chat_history', chat.messages);
      } catch (error) {
        console.error('Error joining chat:', error);
        socket.emit('error', 'Failed to join chat');
      }
    });

    socket.on('send_message', async ({ chatId, senderId, content }) => {
      try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
          return socket.emit('error', 'Chat not found');
        }

        const message = {
          sender: senderId,
          content,
          timestamp: Date.now(),
        };

        chat.messages.push(message);
        chat.lastMessageAt = Date.now();
        await chat.save();

        const chatRoom = createChatRoom(chat.buyer, chat.seller);
        io.to(chatRoom).emit('receive_message', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

function createChatRoom(buyerId, sellerId) {
  return [buyerId, sellerId].sort().join('-');
}

module.exports = initializeWebSocket;
