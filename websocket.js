const Count = require('./models/count');

const roomList = ['room1', 'room2'];

function websocket (server) {
    const io = require('socket.io')(server);
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