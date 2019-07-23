const User = require('../models/user');

module.exports = (app) => {
    app.use((req, res, next) => {
        const _user = req.session.user;
        app.locals.user = _user;
        next();
    });

    // 注册
    app.post('/user/signup', (req, res) => {
        const _user = req.body;
        User.findOne({name: _user.name}, (err, user) => {
            if (err) {
                global.logger.error(err);
            }
            if (user) {
                res.json({
                    errno: 1,
                    data: '用户名已存在'
                });
            } else {
                user = new User(_user);
                user.save((err, user) => {
                    if (err) {
                        global.logger.error(err);
                    }
                    res.json({
                        errno: 0,
                        data: '注册成功'
                    });
                });
            }
        });
    });
}