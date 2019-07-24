// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './assets/styles/main.css';
// 使用museui
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
//import './assets/styles/main.styl';
import {queryString} from '@utils/queryString';
//import socket from './socket';

Vue.use(MuseUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
