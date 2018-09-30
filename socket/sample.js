const MessageCreator = require('../modules/messageCreator');
const CHANNEL = require('../const/channel');

exports.register = (socket) => {
  socket.on('Greet:init', (socket) => {
    const message = MessageCreator('socket server');

    socket.broadcast.emit(CHANNEL.GREET_RECEIVER, message);
  });
}
