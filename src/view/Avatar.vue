<template>
    <div class="wrapper">
        <Header></Header>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {VueCropper} from 'vue-cropper';
import Header from '@components/Header';
import Alert from '@components/Alert';
import Confirm from '@components/Confirm';
import loading from '@components/loading/loading';

export default {
    components: {
        VueCropper,
        Header,
    },
    data () {
        return {
            option: {
                img: getItem('src'),
                size: 1,
                info: true,
                outputType: 'png',
                
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>