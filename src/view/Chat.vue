<template>
    <div>
        <div class="container">
            <div class="title">
                <mu-appbar title="Title" color="primary">
                    <mu-icon value="chevron_left" slot="left" @click="goback"></mu-icon>
                    <div class="center">聊天{{Object.keys(getUsers).length}}</div>
                    <mu-icon value="people" slot="right" @click="openSimpleDialog"></mu-icon>
                </mu-appbar>
            </div>
            <div class="chat-inner">
                <div class="chat-container">
                    <div class="chat-no-people">暂无消息，赶紧来占个沙发~</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
    data () {
        return {
            openSimple: false
        }
    },
    methods: {
        goback () {

        },
        openSimpleDialog () {
            this.openSimple = true;
        }
    },
    computed: {
        ...mapGetters([
            'getUsers',
        ]),
    }
}
</script>

<style>

</style>