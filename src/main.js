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
import './assets/styles/main.styl';
import {queryString} from '@utils/queryString';
import socket from './socket';
import vuePicturePreview from './components/photo-viewer';
Vue.use(vuePicturePreview);

Vue.use(MuseUI);
Vue.config.productionTip = false;

const Notifcation = window.Notification;
const popNotice = function (msgInfo) {
  if (Notifcation.permission === 'granted') {
    let content = '';
    if (msgInfo.img !== '') {
      content = '[图片]';
    } else {
      content = msgInfo.msg;
    }
    const notification = new Notification(`【${msgInfo.roomid}】提示`, {
      body: content,
      icon: msgInfo.src
    });
    notification.onclick = function () {
      notification.close();
    }
  }
}

socket.on('message', function (obj) {
  store.commit('addRoomDetailInfos', [obj]);
  console.log(Notifcation.permission);
  if (Notifcation.permission === 'granted') {
    popNotice(obj);
  } else if (Notification.permission !== 'denied') {
    Notifcation.requestPermission(function (permission) {
      popNotice(obj);
    });
  }
});

document.addEventListener('touchstart', (e) => {
  if (typeof(e.target.className) == 'string') {
    if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
      store.commit('setEmoji', true);
    } else {
      store.commit('setEmoji', false);
    }
  }
});

document.addEventListener('click', (e) => {
  if (typeof(e.target.className) == 'string') {
    if (e.target.className.indexOf('emoji') > -1 || e.target.parentNode.className.indexOf('emoji') > -1) {
      store.commit('setEmoji', true);
    } else {
      store.commit('setEmoji', false);
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
