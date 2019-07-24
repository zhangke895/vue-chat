<template>
    <div>
        <mu-list>
            <mu-sub-header>最近聊天记录</mu-sub-header>
            <mu-list-item>
                <div class="avatar" @click="goChat('room1')">
                    <span class="tip" v-if="unRead1 !== 0">{{unRead1 > 99 ? '99+' : unRead1}}</span>
                    <mu-avatar>
                        <img :src="house1" />
                    </mu-avatar>
                </div>
                <mu-list-item-title>聊天室1</mu-list-item-title>
                <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item>
            <mu-list-item>
                <div class="avatar" @click="goChat('room2')">
                    <span class="tip" v-if="unRead2 !== 0">{{unRead2 > 99 ? '99+' : unRead2}}</span>
                    <mu-avatar>
                        <img :src="house2" />
                    </mu-avatar>
                </div>
                <mu-list-item-title>聊天室2</mu-list-item-title>
                <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item>
        </mu-list>
        <mu-list>
            <mu-sub-header>客服</mu-sub-header>
            <mu-list-item>
                <mu-avatar @click="chatRobot()">
                    <img :src="robot" />
                </mu-avatar>
                <mu-list-item-title>客服</mu-list-item-title>
                <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item>
        </mu-list>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import { ROBOT_URL, HOST_URL1, HOST_URL2 } from "@const/index";
import socket from '../socket';
import Confirm from '@components/Confirm';

export default {
    data () {
        return {
            house1: HOST_URL1,
            house2: HOST_URL2,
            robot: ROBOT_URL
        }
    },
    async mounted () {
        this.$store.commit('setTab', true);
        // 只全局监听一次
        if (!this.isLogin) {
            // 登录了，发送进入信息
            if (this.userid) {
                // 处理未读消息
                socket.on('count', userCount => {
                    this.$store.commit('setUnread', userCount);
                    console.log(userCount);
                });
                this.$store.commit('setLoginState', true);
            }
        }
    },
    methods: {
        async goChat (roomId) {
            const userId = this.userid;
            if (!userId) {
                const res = await Confirm({
                    title: '提示',
                    content: '聊天请先登录，但是你可以查看聊天记录哦~'
                });
                if (res === 'submit') {
                    this.$router.push({path: '/login'});
                }
                return;
            }
            this.$store.commit('setTab', false);
            this.$router.push({path: '/chat', query: {roomId: roomId}});
        },
        chatRobot () {
            this.$store.commit('setTab', false);
            this.$router.push({path: '/robot'});
        }
    },
    computed: {
        ...mapState({
            userid: state => state.userInfo.userid,
            src: state => state.userInfo.src,
            isLogin: state => state.isLogin,
            unRead1: state => state.unRead.room1,
            unRead2: state => state.unRead.room2
        })
    }
}

</script>

<style lang="less" scoped>
.avatar {
    position: relative;
    margin-right: 10px;
    .tip {
        position: absolute;
        right: -5px;
        top: -8px;
        padding: 0 5px;
        border-radius: 10px;
        line-height: 20px;
        text-align: center;
        background: #ff2a2a;
        color: #fff;
        font-size: 12px;
    }
    .mu-avatar {
        img {
            border-radius: 5px;
        }
    }
}
.mu-list li {
    margin-top: 10px;
}
</style>