const Count = require('./models/count');

let cache = {};
cache = require('./cache/cache');

const roomList = ['room1', 'room2'];

function websocket (server) {
    const io = require('socket.io')(server);
    const users = {};
    io.on('connection', (socket) => {
        console.log('connect!');
        // 监听用户发布的聊天内容

        // 建立连接
        socket.on('login', async (user) => {
            console.log('socket login!');
            const {name} = user;
            if (!name) {
                return;
            }
        });
        // 加入房间
        socket.on('room', async (user) => {
            console.log('socket add room!');
            const {name, roomid} = user;
            if (!name || !roomid) {
                return;
            }
            socket.name = name;
            socket.roomid = roomid;
            if (!users[roomid]) {
                users[roomid] = {};
            }
            // 初始化user
            users[roomid][name] = Object.assign({}, {
                socketid: socket.id
            }, user);
            console.log(users[roomid][name]);
            const key = `${name}-${roomid}`;
            console.log(key);
            await updatehCache('socketId', name, socket.id);
            // 进入房间默认置空，表示全部已读
            await resetCacheById(key);
            // 进行会话
            socket.join(roomid);
            const onlineUsers = {};
            for (let item in users[roomid]) {
                onlineUsers[item] = {};
                onlineUsers[item].src = users[roomid][item].src;
            }
            io.to(roomid).emit('room', onlineUsers);
            //global.logger.info(`${name} 加入了 ${roomid}`);
        });
    });
}

function findOne (query) {
    return new Promise((resv, rej) => {
        Count.findOne(query, (err, res) => {
            if (err) {
                rej(err);
                return;
            }
            resv(res);
        });
    });
}

module.exports = websocket;