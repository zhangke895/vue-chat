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
        unRead: {
            room1: 0,
            room2: 0
        },
        // 是否启动tab
        istab: false,
    }
});

export default store;