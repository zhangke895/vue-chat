import Axios from './axios';
const baseUrl = 'http://localhost:9090';

const Service = {
    // 登录接口
    login: data => Axios.post(baseUrl + '/user/signin', data),
    // 注册接口
    register: data => Axios.post(baseUrl + '/user/signup', data)
};

export default Service;