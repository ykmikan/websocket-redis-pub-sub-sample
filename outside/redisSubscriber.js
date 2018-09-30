const redis = require('redis');
const MessageCreator = require('../modules/messageCreator');
const CHANNEL = require('../const/channel');
const { redis: redisConf = {} } = require('../config');

const Subscriber = redis.createClient(redisConf.port, redisConf.host);
const SYNC_GREETING_CHANNEL = 'SyncGreeting';

Subscriber.subscribe(SYNC_GREETING_CHANNEL);

exports.register = (emitter) => {
  Subscriber.on('message', (channel) => {
    switch (channel) {
      case SYNC_GREETING_CHANNEL:
        const message = MessageCreator('socket server');

        emitter.to(CHANNEL.GREET_RECEIVER).emit(message);
        break;
    }
  });
};
