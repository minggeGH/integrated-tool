import axios from 'axios';
import { getUrlParams } from '@/utils/utils'

// 创建axios的实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, //  , // url = base url + request url
  timeout: 30000, // 超时时间
});
service.interceptors.request.use(
  (config) => {
    if (getUrlParams("token")) {
      config.headers.token = getUrlParams("token")
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // 响应拦截器处理
    return response.data;
  },
  (error) => {
    Promise.reject(error)
  }
);
// 导出至外层utils文件夹的index.ts，方便统一使用utils
export default service;
