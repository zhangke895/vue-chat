<template>
    <div>
        <div class="header">
            <div class="head">
                <img :src="src" alt="" />
            </div>
            <div class="name">{{userid}}</div>
            <div class="background">
                <img :src="src" alt="" />
            </div>
        </div>
        <div class="content">
            <mu-list>
                <mu-list-item>
                    <mu-icon value="send" @click="changeAvatar"></mu-icon>
                    <mu-list-item-title>修改头像</mu-list-item-title>
                </mu-list-item>
                <mu-list-item>
                    <mu-icon value="drafts"  @click="rmLocalData"></mu-icon>
                    <mu-list-item-title>清除缓存</mu-list-item-title>
                </mu-list-item>
            </mu-list>
        </div>
        <div class="logout">
            <mu-button @click="logout" class="demo-raised-button">退出</mu-button>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {clear, removeItem} from '@utils/localStorage';
import Confirm from '@components/Confirm';
//import Alert from '@components/Alert';

export default {
    data () {
        return {};
    },
    async mounted () {
        this.$store.commit('setTab', true);
        if (!this.userid) {
            const data = await Confirm({
                title: '提示',
                content: '需要登录后才能查看哦~',
                ok: '去登录',
                cancel: '返回首页'
            });
            if (data === 'submit') {
                this.$router.push('/login');
                return;
            }
            this.$router.push('/');
        }
    },
    methods: {
        changeAvatar () {
            this.$router.push('/avatar');
            this.$store.commit('setTab', false);
        },
        async rmLocalData () {
            const data = await Confirm({
                title: '提示',
                content: '清除缓存会导致更新历史再次提醒，确定清除?'
            });
            if (data === 'submit') {
                removeItem('update-20180916');
            }
        },
        async logout () {
            const data = await Confirm({
                title: '提示',
                content: '你忍心离开吗?'
            });
            if (data === 'submit') {
                clear();
                this.$store.commit('setUserInfo', {
                    type: 'userid',
                    value: ''
                });
                this.$store.commit('setUserInfo', {
                    type: 'src',
                    value: ''
                });
                this.$store.commit('setUnread', {
                    room1: 0,
                    room2: 0
                });
                this.$router.push('/');
                this.$store.commit('setTab', false);
            }
        }
    },
    computed: {
        ...mapState({
            userid: state => state.userInfo.userid,
            src: state => state.userInfo.src
        })
    }
}
</script>

<style lang="scss" scoped>
.header {
    position: relative;
    width: 100%;
    height: 200px;
    display: inline-block;
    .head {
        width: 80px;
        margin: 20px auto 0;
        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }
    .name {
        height: 50px;
        line-height: 50px;
        color: #fff;
        font-size: 18px;
        text-align: center;
    }
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200px;
        z-index: -1;
        filter: blur(10px);
        img {
            width: 100%;
            height: 100%;
        }
    }
}
.logout {
    width: 90%;
    margin: 0 auto;
    .demo-raised-button {
        width: 100%;
        background: #ff4081;
        color: #fff;
    }
}
.mu-icon { margin-right: 10px;}
</style>



















