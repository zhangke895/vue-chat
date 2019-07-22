import axios from 'axios';
const baseURL = '';
const instance = axios.create();
instance.defaults.timeout = 30000; // 所有接口30s超时
