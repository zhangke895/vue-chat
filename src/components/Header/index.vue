<template>
    <div class="header">
        <div class="title">
            <mu-appbar title="Title">
                <mu-icon slot="left" value="chevron_left" @click="goback"></mu-icon>
                <div class="center"></div>
                <mu-icon slot="right" value="expand_more"></mu-icon>
            </mu-appbar>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data () {
        return {};
    },
    computed: {},
    methods: {
        goback () {
            this.$router.goback();
            this.$store.commit('setTab', true);
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    height: 56px;
}
.title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
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
}

</style>