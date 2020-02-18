import axios from 'axios';
import qs from 'qs';
console.log("loading.....");
const baseUrl='http://ncact.jinghangapps.com';
axios.defaults.withCredentials = false;
axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = baseUrl;   //配置接口地址
//axios  request拦截
//axios response 拦截器

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export function FetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params,
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {   
                reject(error);
            });
    });
}
