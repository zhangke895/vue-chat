<template>
    <div>
        <div class="container">
            <mu-dialog width="360" :open.sync="openSimple">
                <div class="all-chat">
                    <div slot="title">在线人员</div>
                    <div v-for="(obj, index) in getUsers" class="online" :key="index">
                        <img :src="obj.src" alt="" />
                    </div>
                </div>
                <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button>
            </mu-dialog>
            <div class="title">
                <mu-appbar title="Title" color="primary" class="appBar">
                    <mu-icon value="chevron_left" slot="left" @click="goback"></mu-icon>
                    <div class="center">聊天{{Object.keys(getUsers).length}}</div>
                    <mu-icon value="people" slot="right" @click="openSimpleDialog"></mu-icon>
                </mu-appbar>
            </div>
            <div class="chat-inner">
                <div class="chat-container">
                    <div class="chat-no-people" v-if="getInfos.length === 0">暂无消息，赶紧来占个沙发~</div>
                    <div class="chat-loading" v-if="getInfos.length !== 0 && isloading">
                        <div class="lds-css ng-scope">
                            <div class="lds-rolling">
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <Message v-for="obj in getInfos" :key="obj._id" :is-self="obj.username === userid" :name="obj.username" :head="obj.src" :msg="obj.msg" :img="obj.img" :mytime="obj.time" :container='container'></Message>
                    <div class="clear"></div>
                </div>
            </div>
            <div class="bottom">
                <div class="functions">
                    <div class="fun-li" @click="imgUpLoad"><i class="icon iconfont icon-camera"></i></div>
                    <div class="fun-li emoji">
                        <i class="icon iconfont icon-emoji"></i>
                        <div class="emoji-content" v-show="getEmoji">
                            <div class="emoji-tabs">
                                <div class="emoji-container" ref="emoji">
                                    <div class="emoji-block" :style="{width: Math.ceil(emoji.people.length / 5) * 48 + 'px'}">
                                        <span v-for="(item, index) in emoji.people" :key="index">{{item}}</span>
                                    </div>
                                    <div class="emoji-block" :style="{width: Math.ceil(emoji.nature.length / 5) * 48 + 'px'}">
                                        <span v-for="(item, index) in emoji.nature" :key="index">{{item}}</span>
                                    </div>
                                    <div class="emoji-block" :style="{width: Math.ceil(emoji.items.length / 5) * 48 + 'px'}">
                                        <span v-for="(item, index) in emoji.items" :key="index">{{item}}</span>
                                    </div>
                                    <div class="emoji-block" :style="{width: Math.ceil(emoji.place.length / 5) * 48 + 'px'}">
                                        <span v-for="(item, index) in emoji.place" :key="index">{{item}}</span>
                                    </div>
                                    <div class="emoji-block" :style="{width: Math.ceil(emoji.single.length / 5) * 48 + 'px'}">
                                        <span v-for="(item, index) in emoji.single" :key="index">{{item}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="fun-li"><i class="icon iconfont icon-zanshang"></i></div>
                    <div class="fun-li"><i class="icon iconfont icon-wenti"></i></div>
                </div>
                <div class="chat">
                    <div class="input">
                        <input type="text" v-model="chatValue" />
                    </div>
                    <mu-button class="demo-raised-button" color="primary" @click="submit">发送</mu-button>
                </div>
                <input id="inputFile" name="inputFile" type="file" multiple="mutiple" accept="image/*;capture=camera" style="display: none" @change="fileUp" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import emoji from '@utils/emoji';
import {queryString} from '@utils/queryString';
import url from '@api/server';
import {setItem, getItem} from '@utils/localStorage';
import socket from '../socket';
import loading from '@components/loading/loading';
import debounce from 'lodash/debounce';
import Alert from '@components/Alert';
import {inHTMLData} from 'xss-filters-es6';
import Message from '@components/Message';
import {setTimeout} from 'timers';

export default {
    data () {
        const notice = getItem('notice') || {};
        const {noticeBar, noticeVersion} = notice;
        return {
            isloading: false,
            roomid: '',
            openSimple: false,
            emoji: emoji,
            chatValue: '',
            current: 1,
            noticeList: [],
            noticeBar: !!noticeBar,
            noticeVersion: noticeVersion || '20181222',
        }
    },
    components: {
        Message
    },
    async created () {
        const roomId = queryString(window.location.href, 'roomId');
        this.roomid = roomId;
        if (!roomId) {
            this.$router.push({path: '/'});
        }
        if (!this.userid) {
            // 防止未登录
            this.$router.push({path: '/login'});
        }
        const res = await url.getNotice();
        this.noticeList = res.data.noticeList;
        if (res.data.version !== res.data.version) {
            this.noticeBar = false;
        }
        this.noticeVersion = res.data.version;
    },
    async mounted () {
        this.container = document.querySelector('.chat-inner');
        const that = this;
        await this.$store.commit('setRoomDetailInfos');
        await this.$store.commit('setTotal', 0);
        const obj = {
            name: this.userid,
            src: this.src,
            roomid: this.roomid
        };
        socket.emit('room', obj);
        socket.on('room', function (obj) {
            that.$store.commit('setUsers', obj);
        });
        socket.on('roomout', function (obj) {
            that.$store.commit('setUsers', obj);
        });
        loading.show();
        setTimeout(async () => {
            const data = {
                total: +this.getTotal,
                current: +this.current,
                roomid: this.roomid
            };
            this.isloading = true;
            await this.$store.dispatch('getAllMessHistory', data);
            this.isloading = false;
            loading.hide();
            this.$nextTick(() => {
                this.container.scrollTop = 10000;
            });
        }, 500);
        this.container.addEventListener('scroll', debounce(async (e) => {
            if (e.target.scrollTop >= 0 && e.target.scrollTop < 50) {
                this.$store.commit('setCurrent', +this.getCurrent + 1);
                const data = {
                    total: +this.getTotal,
                    current: +this.getCurrent,
                    roomid: this.roomid
                };
                this.isloading = true;
                await this.$store.dispatch('getAllMessHistory', data);
                this.isloading = false;
            }
        }, 50));
        this.$refs.emoji.addEventListener('click', function (e) {
            var target = e.target || e.srcElement;
            if (!!target && target.tagName.toLowerCase() === 'span') {
                that.chatValue = that.chatValue + target.innerHTML;
            }
            e.stopPropagation();
        });
    },
    methods: {
        goback () {
            const obj = {
                name: this.userid,
                roomid: this.roomid
            };
            socket.emit('roomout', obj);
            this.$router.goBack();
            this.$store.commit('setTab', true);
            this.$store.commit('setCurrent', 0);
        },
        openSimpleDialog () {
            this.openSimple = true;
        },
        closeSimpleDialog () {
            this.openSimple = false;
        },
        submit () {
            // 判断发送信息是否为空
            if (this.chatValue !== '') {
                if (this.chatValue.length > 200) {
                    Alert({
                        content: '请输入100字以内'
                    });
                    return;
                }
                const msg = inHTMLData(this.chatValue); // 防止xss
                const obj = {
                    username: this.userid,
                    src: this.src,
                    img: '',
                    msg,
                    roomid: this.roomid,
                    time: new Date()
                };
                // 传递消息
                socket.emit('message', obj);
                this.chatValue = '';
            } else {
                Alert({
                    content: '内容不能为空'
                });
            }
        },
        imgUpLoad () {
            const file = document.getElementById('inputFile');
            file.click();
        },
        fileUp () {
            const that = this;
            const file1 = document.getElementById('inputFile').files[0];
            if (file1) {
                const formdata = new window.FormData();
                formdata.append('file', file1);
                formdata.append('username', this.userid);
                formdata.append('src', this.src);
                formdata.append('roomid', that.roomid);
                formdata.append('time', new Date());
                this.$store.dispatch('uploadImg', formdata);
                const fr = new window.FileReader();
                fr.onload = function () {
                    const obj = {
                        username: that.userid,
                        src: that.src,
                        img: fr.result,
                        msg: '',
                        roomid: that.roomid,
                        time: new Date()
                    };
                    socket.emit('message', obj);
                };
                fr.readAsDataURL(file1);
                this.$nextTick(() => {
                    this.container.scrollTop = 10000;
                });
            } else {
                console.log('必须要有文件');
            }
        }
    },
    computed: {
        ...mapGetters([
            'getUsers',
            'getEmoji',
            'getInfos',
            'getCurrent',
            'getTotal'
        ]),
        ...mapState({
            userid: state => state.userInfo.userid,
            src: state => state.userInfo.src,
        }),
    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f1f5f8;
    -webkit-overflow-scrolling: touch;
    .title {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 2;
        .center {
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            padding-left: 8px;
            padding-right: 8px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 20px;
            font-weight: 400;
            line-height: 56px;
            text-align: center;
        }
        .appBar {
            padding-right:8px;
        }
    }
    .chat-inner {
        position: absolute;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        top: 56px;
        bottom: 80px;
        .chat-container {
            overflow: hidden;
            .chat-no-people {
                width: 100%;
                height: 300px;
                line-height: 300px;
                text-align: center;
                color: #D1CFD2;
            }
        }
    }
    .bottom {
        position: fixed;
        width: 100%;
        height: 80px;
        bottom: 0;
        left: 0;
        z-index: 1;
        border-top: 1px solid #ddd;
        background: #f7f6fb;
        .functions {
            width: 100%;
            .fun-li {
                width: 40px;
                height: 30px;
                display: inline-block;
                position: relative;
                color: #828187;
                text-align: center;
                .iconfont {
                    font-size: 20px;
                }
            }
            .emoji-content {
                position: absolute;
                bottom: 30px;
                left: -42px;
                width: 375px;
                height: 210px;
                border-top: 1px solid #f3f3f3;
                overflow: hidden;
                background-color: #fff;
                .emoji-container {
                    width: 10000px;
                }
                .emoji-tabs {
                    overflow: auto;
                    .emoji-block {
                        width: 1170px;
                        height: 200px;
                        float: left;
                        span {
                            display: inline-block;
                            cursor: pointer;
                            font-size: 26px;
                            min-width: 48px;
                            line-height: 39px;
                            text-align: center;
                            list-style: none;
                        }
                    }
                }
            }
        }
        .chat {
            width: 100%;
            display: flex;
            .input {
                flex: 1;
                padding: 0 4px 4px 4px;
                input {
                    width: 100%;
                    height: 41px;
                    box-sizing: border-box;
                    border: 1px solid #e8e7ea;
                    border-radius: 3px;
                    color: #333333;
                    font-size: 19px;
                    padding-left: 5px;
                }
            }
            .demo-raised-button {
                margin-right: 8px;
                min-width: 80px;
                width: 80px;
                height: 40px;
            }
        }
    }
}

@keyframes lds-rolling {
    0% {
        -webkit-transform: translate(-50%, -50%) rotate(0deg);
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        -webkit-transform: translate(-50%, -50%) rotate(360deg);
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
@-webkit-keyframes lds-rolling {
    0% {
        -webkit-transform: translate(-50%, -50%) rotate(0deg);
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        -webkit-transform: translate(-50%, -50%) rotate(360deg);
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.chat-loading {
    .lds-rolling {
        height: 40px;
        overflow: hidden;
    }
    .lds-rolling div, .lds-rolling div:after {
        width: 20px;
        height: 20px;
        border: 2px solid #2196f3;
        border-top-color: transparent;
        border-radius: 50%;
        margin: 20px auto 0;
    }
    .lds-rolling div {
        -webkit-animation: lds-rolling 1s linear infinite;
        animation: lds-rolling 1s linear infinite;
    }
    .lds-rolling div:after {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
    }
}

.all-chat {
    .online {
        display: inline-block;
        margin: 5px;
        img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
        }
    }
}
</style>