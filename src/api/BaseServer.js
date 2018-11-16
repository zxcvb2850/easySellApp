import {AsyncStorage} from "react-native";
import axios from 'axios';
import {BASE_URL} from '../config/config';
import {showToast} from "../common/util";

let TOKEN = ""
AsyncStorage.getItem("shop_token", (err, result) => {
    TOKEN = result;
    console.log('---------', TOKEN)
});

// axios.defaults.baseURL = BASE_URL + PROPT;
axios.defaults.timeout = 100000

//axios拦截器
axios.interceptors.request.use(config => {//拦截器处理
    // config.headers['Authorization'] = "12233334"
    config.headers['token'] = TOKEN//请求头中自带token
    if (config.method === 'get') {
        config.params = {
            ...config.data,
            _t: Date.parse(new Date()) // 1000
        }
    }
    return config
}, error => {
    showToast('请求超时', 'error');
    return Promise.resolve(error);
})

axios.interceptors.response.use(response => {//请求返回数据处理
    console.log(response)
    if (response.status && response.status === 200 && response.data.code !== 0) {
        showToast(response.data.msg, 'error');
    }
    return response;
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = "错误请求";
                break;
            case 401:
                error.message = "未授权，请重新登陆";
                break;
            case 403:
                error.message = "拒绝访问";
                break;
            case 404:
                error.message = "请求错误，未找到该资源";
                break;
            case 405:
                error.message = "请求方法未允许";
                break;
            case 408:
                error.message = "请求超时";
                break;
            case 500:
                error.message = "服务器错误";
                break;
            case 501:
                error.message = "网络未实现";
                break;
            case 502:
                error.message = "网络错误";
                break;
            case 503:
                error.message = "服务器不可用";
                break;
            case 504:
                error.message = "网络超时";
                break;
            case 505:
                error.message = "http版本不支持该请求";
                break;
            default:
                error.message = `连接错误${error.response.status}`;
                break;
        }
    } else {
        error.message = "连接服务器失败";
    }
    showToast(error.message, 'error');
    return Promise.resolve(error.response);
})

//请求的封装
export default class BaseServer {
    static async get(url, params, isShowError = false) {
        return new Promise((resolve, reject) => {
            console.log(url, params)
            let data = '';
            if (params && params !== 'undefined') {
                data = params;
            }
            axios.get(BASE_URL + url + '?' + data).then((res) => {
                console.log(res);
                if (res != null) {
                    res = res.data;
                    if (isShowError) {
                        resolve(res)
                    } else {
                        if (res.code !== 0) {
                            reject(res.msg);
                        } else {
                            resolve(res);
                        }
                    }
                }
            })
        })
    }

    static async post(url, params, isShowError = false) {
        return new Promise((resolve, reject) => {
            axios.post(BASE_URL + url, params)
                .then((res) => {
                    if (res != null) {
                        res = res.data;
                        if (isShowError) {
                            resolve(res)
                        } else {
                            if (res.code !== 0) {
                                reject(res.msg);
                            } else {
                                resolve(res);
                            }
                        }
                    }
                })
        })
    }

    static async patch(url, params) {
        try {
            let res = await axios.patch(url, params)
            return res
        } catch (error) {
            return error
        }
    }

    static async put(url, params) {
        try {
            let res = await axios.put(url, params)
            return res
        } catch (error) {
            return error
        }
    }

    static async delete(url, params) {
        /**
         * params默认为数组
         */
        try {
            let res = await axios.post(url, params)
            return res
        } catch (error) {
            return error
        }
    }
}
