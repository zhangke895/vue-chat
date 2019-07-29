import Axios from './axios';
const baseUrl = 'http://localhost:9090';

const Service = {
    // 登录接口
    login: data => Axios.post(baseUrl + '/user/signin', data),
    // 注册接口
    register: data => Axios.post(baseUrl + '/user/signup', data),
    // 请求公告
    getNotice: () => Axios.get('https://s3.qiufengh.com/config/notice-config.js'),
    // 获取当前房间所有历史记录
    RoomHistoryAll: data => Axios.get(baseUrl + '/history/message', { params: data}),
    // 上传图片
    postUploadFile: data => Axios.post(baseUrl + '/file/uploadimg', data, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }),
    postUploadAvatar: data => Axios.post(baseUrl + '/file/avatar', data, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }),
    // 请求公告
    getNotice: () => Axios.get('https://s3.qiufengh.com/config/notice-config.js')
};

export default Service;