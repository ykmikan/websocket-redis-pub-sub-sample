const io = require('socket.io')();
const socketRedis = require('socket.io-redis');
const ioEmitter = require('socket.io-emitter');
const glob = require('glob');
const {
  redis: redisConf = {},
  socket: socketConf = {},
} = require('./config');

// for different process or server
io.adapter(socketRedis({
  host: redisConf.host,
  port: redisConf.port,
}));

const emitter = ioEmitter({
  host: redisConf.host,
  port: redisConf.port,
});

// load outside emit event
const outsideEmitterPaths = glob.sync(`${process.cwd()}/outside/*.js`);

outsideEmitterPaths.forEach(outsideEmitterPath => {
  require(outsideEmitterPath).register(emitter);
});

const onDisconnect = socket => { console.log('socket disconnected!!'); }

const onConnect = socket => {
  const socketControllerPaths = glob.sync(`${process.cwd()}/socket/*.js`);

  // load socket methods
  socketControllerPaths.forEach(socketControllerPath => {
    require(socketControllerPath).register(socket);
  });
}

io.on('connection', socket => {
  // Call onDisconnect.
  socket.on('disconnect', () => onDisconnect(socket));

  // Call onConnect.
  onConnect(socket);
  console.log('socket connected!!');
});

io.listen(socketConf.port);
console.log(`socket server is started on ${socketConf.port}`);
