<template>
    <div class="register">
        <div class="header"></div>
        <mu-container>
            <mu-form ref="form" :model="validateForm" class="mu-demo-form">
                <mu-form-item label="用户名" prop="username" :rules="usernameRules">
                    <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
                </mu-form-item>
                <mu-form-item label="密码" prop="password" :rules="passwordRules">
                    <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="isAgree" :rules="argeeRules">
                    <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
                </mu-form-item>
                <mu-form-item>
                    <mu-button color="primary" @click="submit">注册</mu-button>
                    <mu-button @click="login">登录</mu-button>
                </mu-form-item>
            </mu-form>
        </mu-container>
    </div>
</template>

<script>
//import {mapState} from 'vuex';
import socket from '../socket';

export default {
    data () {
        return {
            usernameRules: [
                { validate: (val) => !!val, message: '必须填写用户名'},
                { validate: (val) => val.length >= 3, message: '用户名长度大于3'}
            ],
            passwordRules: [
                { validate: (val) => !!val, message: '必须填写密码'},
                { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
            ],
            argeeRules: [
                { validate: (val) => !!val, message: '必须同意用户协议'}
            ],
            validateForm: {
                username: '',
                password: '',
                isAgree: false
            }
        }
    },
    mounted () {
        this.$store.commit('setTab', false);
    },
    methods: {
        submit () {
            const src = `//s3.qiufengh.com/avatar/${Math.ceil(Math.random() * 272)}.jpeg`;
            this.$refs.form.validate().then(async (result) => {
                const data = {
                    name: this.validateForm.username,
                    password: this.validateForm.password,
                    src: src
                };
                const res = await this.$store.dispatch("registerSubmit", data);
                if (res.status === 'success') {
                    this.$store.commit('setUserInfo', {
                        type: 'userid',
                        value: data.name
                    });
                    this.$store.commit('setUserInfo', {
                        type: 'src',
                        value: data.src
                    });
                    this.$router.push({path: '/'});
                    socket.emit('login', {name: data.name});
                }
            });
        },
        login () {
            this.$router.push({path: '/login'});
        }
    }
}
</script>

<style>

</style>