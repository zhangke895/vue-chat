import axios from 'axios';
const baseURL = '';
const instance = axios.create();
instance.defaults.timeout = 30000; // 所有接口30s超时
// 请求统一处理
instance.interceptors.request.use(async config => {
    if (config.url && config.url.charAt(0) === '/') {
        config.url = `${baseURL}${config.url}`;
    }
    return config;
}, error => Promise.reject(error));

export default instance;
