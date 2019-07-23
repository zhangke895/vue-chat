import Vue from 'vue';
import './index.css';

const root = window.document.body;

export default function Alert (config) {
    const wrap = document.createElement('div');
    const div = document.createElement('div');
    wrap.style.position = 'absolute';
    wrap.style.width = '100%';
    wrap.style.height = '100%';
    wrap.style.left = '0';
    wrap.style.top = '0';
    root.appendChild(wrap);
    wrap.appendChild(div);
    config = config || {};

    return new Promise(resolve => new Vue({
        el: div,
        data: {
            title: config.title || '',
            content: config.content || '',
            ok: config.ok || '确定',
            cancel: config.cancel || '取消'
        },

    }));
}