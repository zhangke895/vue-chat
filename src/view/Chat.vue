<template>
    <div>
        <div class="container">
            <div class="title">
                <mu-appbar title="Title" color="primary" class="appBar">
                    <mu-icon value="chevron_left" slot="left" @click="goback"></mu-icon>
                    <div class="center">聊天{{Object.keys(getUsers).length}}</div>
                    <mu-icon value="people" slot="right" @click="openSimpleDialog"></mu-icon>
                </mu-appbar>
            </div>
            <div class="chat-inner">
                <div class="chat-container">
                    <div class="chat-no-people">暂无消息，赶紧来占个沙发~</div>
                    <div class="chat-loading">
                        <div class="lds-css ng-scope">
                            <div class="lds-rolling">
                                <div></div>
                            </div>
                        </div>
                    </div>




                </div>

            </div>
            <div class="bottom">
                <div class="functions">
                    <div class="fun-li"><i class="icon iconfont icon-camera"></i></div>
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
                    <mu-button class="demo-raised-button" color="primary">发送</mu-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import emoji from '@utils/emoji';
export default {
    data () {
        return {
            isloading: false,
            roomid: '',
            openSimple: false,
            emoji: emoji,
            chatValue: '',
            current: 1,
        }
    },
    components: {

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
            'getEmoji',
        ]),
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
</style>