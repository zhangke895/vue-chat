<template>
    <div class="container">
        <div class="title">
            <mu-appbar title="Title">
                <mu-icon value="chevron_left" slot="left" @click="goback"></mu-icon>
                <div class="center"></div>
                <mu-icon value="expand_more" slot="right"></mu-icon>
            </mu-appbar>
        </div>
        <div class="chat-inner">
            <div v-for="(obj, index) in getRobotMsg" :key="index" class="">
                <Message :is-self="obj.username === hoster" :name="obj.username" :head="obj.src" :msg="obj.msg" :img="obj.img" :mytime="obj.time"></Message>
            </div>
        </div>
        <div class="con-input">
            <div class="input"><input type="text" id="msg" /></div>
            <mu-button class="demo-raised-button" color="primary" @click="submit">发送</mu-button>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import Alert from '@components/Alert';
import Message from '@components/Message';
import {HOSTER_URL, HOSTER_NAME} from '@const/index';

export default {
    data () {
        return {
            hoster: HOSTER_NAME,
            hosterImg: HOSTER_URL
        };
    },
    mounted () {

    },
    methods: {
        goback () {
            this.$router.goBack();
            this.$store.commit('setTab', true);
        },
        submit () {
            const info = document.getElementById('msg').value;
            if (info === '') {
                Alert({
                    content: '内容不能为空'
                });
                return;
            }
            const id = this.userid;
            const data = {
                info,
                id
            };
            this.$store.commit('setRobotMsg', {
                msg: info,
                username: this.hoster,
                src: this.hosterImg
            });
            this.$store.dispatch('getRobatMess', data);

        },

    }
}
</script>

<style>

</style>