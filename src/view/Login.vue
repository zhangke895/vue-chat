<template>
    <div class="login">
        <div class="header"></div>
        <mu-container>
            <mu-form ref="form" :model="validateForm" class="mu-demo-form">
                <mu-form-item label="用户名" prop="username" :rules="usernameRules">
                    <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
                </mu-form-item>
                <mu-form-item label="密码" prop="password" :rules="passwordRules">
                    <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
                </mu-form-item>
                <mu-form-item>
                    <mu-button color="primary" @click="submit">登录</mu-button>
                    <mu-button @click="register">注册</mu-button>
                </mu-form-item>
            </mu-form>
        </mu-container>
    </div>
</template>

<script>
import socket from "../socket";

export default {
    data () {
        return {
            usernameRules: [
                { validate: (val) => !!val, message: '必须填写用户名'}
            ],
            passwordRules: [
                { validate: (val) => !!val, message: '必须填写密码'}
            ],
            validateForm: {
                username: '',
                password: ''
            }
        }
    },
    mounted () {
        this.$store.commit('setTab', false);
    },
    methods: {
        submit () {
            this.$refs.form.validate().then(async (result) => {
                const data = {
                    name: this.validateForm.username,
                    password: this.validateForm.password
                };
                const res = await this.$store.dispatch("loginSubmit", data);
                if (res.status === 'success') {
                    this.$store.commit('setUserInfo', {
                        type: 'userid',
                        value: res.data.name
                    });
                    this.$store.commit('setUserInfo', {
                        type: 'src',
                        value: res.data.src
                    });
                    this.$router.push({path: '/'});
                    //socket.emit('login', {name: data.name});
                }
            });
        },
        register () {
            this.$router.push({path: '/register'})
        }
    }
}
</script>

<style>

</style>