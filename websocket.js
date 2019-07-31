const Count = require('./models/count');
const Message = require('./models/message');
const xssFilters = require('xss-filters');

let cache = {};
cache = require('./cache/cache');

const {
    updatehCache,
    resetCacheById,
    getCacheById,
    gethAllCache,
    updateCache,
    inrcCache,
    gethCacheById
} = cache;

const roomList = ['room1', 'room2'];

function websocket (server) {
    const io = require('socket.io')(server);
    const users = {};

    setInterval(async () => {
        const usersList = await gethAllCache('socketId');
        for (let i = 0; i < usersList.length; i++) {
            const name = usersList[i];
            for (let j = 0; j < roomList.length; j++) {
                const roomid = roomList[j];
                const username = `${name}-${roomid}`;
                const roomInfo = await getCacheById(username);
                const res = await findOne({username});
                if (res) {
                    Count.updateOne({username}, {roomInfo}, (err) => {
                        if (err) {
                            console.log('更新失败');
                        }
                    });
                } else {
                    const count = new Count({
                        username,
                        roomInfo: +roomInfo
                    });
                    count.save(function (err, res) {
                        if (err) {
                            return;
                        }
                    });
                }
            }
        }
    }, 60000);

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
            socket.name = name;
            const roomInfo = {};
            await updatehCache('socketId', name, socket.id);
            for (let i = 0; i < roomList.length; i++) {
                const roomid = roomList[i];
                const key = `${name}-${roomid}`;
                // 循坏所有房间
                const res = await findOne({username: key});
                const count = await getCacheById(key);
                if (res) {
                    // 数据库查数据，若缓存中没有数据，更新缓存
                    if (+count === 0) {
                        updateCache(key, res.roomInfo);
                    }
                    roomInfo[roomid] = res.roomInfo;
                } else {
                    roomInfo[roomid] = +count;
                }
            }
            // 通知自己有多少条未读消息
            socket.emit('count', roomInfo);
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
        socket.on('roomout', async (user) => {
            console.log('socket loginout!');
            const {name, roomid} = user;
            await handleLogoutRoom(roomid, name);
        });
        const handleLogoutRoom = async (roomid, name) => {
            try {
                if (users[roomid] && users[roomid].hasOwnProperty(name)) {
                    const key = `${name}-${roomid}`;
                    const roomInfo = {};
                    const count = await getCacheById(key);
                    roomInfo[roomid] = count;
                    socket.emit('count', roomInfo);
                    delete users[roomid][name];
                    io.to(roomid).emit('roomout', users[roomid]);
                    socket.leave(roomid);
                }
            } catch (e) {
                console.log(e);
            }
        };
        socket.on('message', async (msgObj) => {
            console.log('socket message!');
            // 向所有客户端广播消息
            const {username, src, msg, img, roomid, time} = msgObj;
            if (!msg && !img) {
                return;
            }
            // 后端限制字符长度
            const msgLimit = msg.slice(0, 200);
            const mess = {
                username,
                src,
                msg: xssFilters.inHTMLData(msgLimit), // 防止xss
                img,
                roomid,
                time
            }
            if (mess.img === '') {
                const message = new Message(mess);
                message.save(function (err, res) {
                    if (err) {
                        return;
                    }
                });
            }
            io.to(mess.roomid).emit('message', mess);
            // 未读消息
            const usersList = await gethAllCache('socketId');
            usersList.map(async item => {
                if (!users[roomid][item]) {
                    const key = `${item}-${roomid}`;
                    await inrcCache(key);
                    const socketid = await gethCacheById('socketId', item);
                    const count = await getCacheById(key);
                    const roomInfo = {};
                    roomInfo[roomid] = count;
                    socket.to(socketid).emit('count', roomInfo);
                }
            });
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