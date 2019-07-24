import Vue from 'vue';
import Vuex from 'vuex';
import {setItem, getItem} from '@utils/localStorage';
import url from '@api/server.js';

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
        // 是否启动tab
        istab: false,
        roomdetail: {
            id: '',
            users: {},
            infos: [],
            current: 1,
            total: 0
        }
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
        }
    },
    getters: {
        getUsers: state => state.roomdetail.users,
    }
});

export default store;