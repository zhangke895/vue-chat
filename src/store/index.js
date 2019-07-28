import Vue from 'vue';
import Vuex from 'vuex';
import {setItem, getItem} from '@utils/localStorage';
import url from '@api/server.js';
import {ROBOT_NAME, ROBOT_URL} from '@const/index';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: {
            src: getItem('src'),
            userid: getItem('userid')
        },
        isLogin: false,
        unRead: {
            room1: 0,
            room2: 0
        },
        // 存放机器人开场白
        robotmsg: [
            {
                username: ROBOT_NAME,
                src: ROBOT_URL,
                msg: '如果微信群过期了,添加作者微信(添加时记得备注:项目交流)'
            },
            {
                username: ROBOT_NAME,
                src: ROBOT_URL,
                img: "https://s3.qiufengh.com/webchat/webcaht-my.jpeg"
            },
            {
                username: ROBOT_NAME,
                src: ROBOT_URL,
                msg: '期待你的加入'
            },
            {
                username: ROBOT_NAME,
                src: ROBOT_URL,
                img: "https://s3.qiufengh.com/webchat/webchat-group.jpeg"
            },
            {
                username: ROBOT_NAME,
                src: ROBOT_URL,
                msg: '如果还有什么想知道的可以问我'
            }
        ],
        // 是否启动tab
        istab: false,
        roomdetail: {
            id: '',
            users: {},
            infos: [],
            current: 1,
            total: 0
        },
        emojiShow: false
    },
    mutations: {
        setTab (state, data) {
            state.istab = data;
        },
        setLoginState (state, value) {
            state.isLogin = value;
        },
        setUnread (state, value) {
            for (let i in value) {
                state.unRead[i] = +value[i];
            }
        },
        setUserInfo (state, data) {
            const {type, value} = data;
            setItem(type, value);
            state.userInfo[type] = value;
        },
        setRoomDetailInfos (state) {
            state.roomdetail.infos = [];
        },
        setTotal (state, value) {
            state.roomdetail.total = value;
        },
        addRoomDetailInfosHis (state, data) {
            const list = state.roomdetail.infos;
            state.roomdetail.infos = data.concat(list);
        },
        addRoomDetailInfos (state, data) {
            state.roomdetail.infos.push(...data);
        },
        setCurrent (state, value) {
            state.roomdetail.current = value;
        },
        setUsers (state, data) {
            state.roomdetail.users = data;
        }
    },
    actions: {
        async registerSubmit ({commit}, data) {
            const res = await url.register(data);
            if (res.data.errno === 0) {
                return {
                    status: 'success',
                    data: res.data
                };
            }
            return {
                status: 'fail',
                data: res.data
            };
        },
        async loginSubmit ({commit}, data) {
            const res = await url.login(data);
            if (res.data.errno === 0) {
                return {
                    status: 'success',
                    data: res.data
                }
            }
            return {
                status: 'fail',
                data: res.data
            }
        },
        async getAllMessHistory ({state, commit}, data) {
            const res = await url.RoomHistoryAll(data);
            if (res.data.data.errno === 0) {
                commit('addRoomDetailInfosHis', res.data.data.data);
                if (!state.roomdetail.total) {
                    commit('setTotal', res.data.data.total);
                }
            }
        }
    },
    getters: {
        getUsers: state => state.roomdetail.users,
        getEmoji: state => state.emojiShow,
        getTotal: state => state.roomdetail.total,
        getCurrent: state => state.roomdetail.current,
        getInfos: state => state.roomdetail.infos,
        getRobotMsg: state => state.robotmsg
    }
});

export default store;