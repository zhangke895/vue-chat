import Vue from 'vue';
import Vuex from 'vuex';
import {setItem, getItem} from '@utils/localStorage';

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
    },
    mutations: {
        setTab (state, data) {
            state.istab = data;
        },
        setLoginState (state, value) {
            state.isLogin = value;
        }
    },

});

export default store;