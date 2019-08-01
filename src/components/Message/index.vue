<template>
    <div class="clear" :class="[isSelf ? 'right' : 'left']" ref="msg">
        <div class="item">
            <div class="name"><span v-if="mytime">{{getdate}}</span>&nbsp;&nbsp;{{name}}</div>
            <span class="head-place"><img :src="avatar" alt="" class="head" /></span>
            <div v-if="img"><img :src="pic" alt="" v-preview="img" class="img" preview-title-enable="true" preview-nav-enable="true" /></div>
            <span v-if="msg"><span v-html="linkMsg" class="msg"></span></span>
        </div>
    </div>
</template>

<script>
import dateFormat from '../../utils/date';
import {inHTMLData, uriInUnQuotedAttr} from 'xss-filters-es6';

export default {
    props: ['name', 'img', 'msg', 'head', 'mytime', 'is-self', 'container', 'isNeedScroll', 'firstNode'],
    computed: {
        getdate () {
            return dateFormat(new Date(this.mytime), 'yyyy-MM-dd HH:mm:ss');
        },
        linkMsg () {
            // 防止xss
            const filterValue = inHTMLData(this.msg);
            return filterValue.replace(
                /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g,
                function($0, $1) {
                    const url = $0;
                    return `<a style="color: #b374ff" href="${uriInUnQuotedAttr(
                        url
                    )}" target="_blank">${uriInUnQuotedAttr(url)}</a>`;
                }
            );
        },
        avatar () {
            let avatar = this.head;
            const reg = /\.\/static\/img\/(\d+)\.jpg/;
            const matches = this.head.match(reg);
            if (matches) {
                avatar = `//s3.qiufengh.com/avatar/${matches[1]}.jpeg`;
            }
            return `${avatar}?imageView2/2/w/120/h/120`;
        },
        pic () {
            let pic = this.img;
            if (pic.indexOf('data:image') > -1) {
                return pic;
            }
            return `${pic}?imageView2/2/w/360`;
        }
    },
    mounted () {
        this.$refs.msg.scrollIntoView();
    }
}
</script>

<style lang="scss" scoped>
.clear {
    .item {
        max-width: 100%;
        position: relative;
        clear: both;
        display: inline-block;
        padding: 16px 40px 16px 20px;
        margin: 20px 10px 20px 10px;
        border-radius: 10px;
        background-color: #fff;
        .img {
            max-width: 200px;
        }
        .name {
            position: absolute;
            top: -20px;
            width: 280px;
            height: 20px;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .msg {
            word-break: break-all;
        }
        .head-place {
            display: block;
            width: 50px;
            height: 50px;
            position: absolute;
            top: 0;
            background: #fff;
            border-radius: 50px;
            overflow: hidden;
        }
        .head {
            width: 50px;
            height: 50px;
            border-radius: 50px;
        }
        &:after {
            position: absolute;
            top: 15px;
            content: '';
            width: 0;
            height: 0;
        }
    }
}
.left {
    .item {
        float: left;
        margin-left: 80px;
        color:  #313035;
        &:after {
            left: -15px;
            border-top: 15px solid #fff;
            border-left: 15px solid transparent;
        }
    }
    .name {
        text-align: left;
        left: -70px;
    }
    .head-place {
        left: -70px;
    }
}
.right {
    .item {
        float: right;
        margin-right: 80px;
        color: #fff;
        background: #2196f3;
        &:after {
            right: -15px;
            border-top: 15px solid #2196f3;
            border-right: 15px solid transparent;
        }
    }
    .name {
        color: #313035;
        text-align: right;
        right: -70px;
    }
    .head-place {
        right: -70px;
    }
}
</style>