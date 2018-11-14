import axios from 'axios';
import qs from 'querystring';
import {BASE_URL, PROPT} from '../config/config';

const TOKEN = localStorage.getItem('shop_token') || '';

axios.defaults.baseURL = BASE_URL + PROPT;
axios.defaults.timeout = 100000

//axios拦截器
axios.interceptors.request.use(config => {//拦截器处理
  config.headers['Authorization'] = "12233334"
  config.headers['token'] = TOKEN//请求头中自带token
  if (config.method === 'get') {
	config.params = {
	  ...config.data,
	  _t: Date.parse(new Date()) // 1000
	}
  }
  return config
})

axios.interceptors.response.use(response => {//请求返回数据处理
//console.log(response)
  if (response.status === '200' || response.status === 200) {
	return response.data.data || response.data
  } else {
// 非200请求抱错
	throw Error(response.opt || '服务异常')
  }
})

//请求的封装
export default class BaseServer {
  static async get(url, params, isShowError) {
	/**
	 * params{
	 * goods：id，
	 * name：string
	 * } ==> ?goods=id&name=string
	 */
	try {
	  let query = await qs.stringify(params)
	  let res = null;
	  if (!params) {
		res = await axios.get(url)
	  } else {
		res = await axios.get(url + '?' + query)
	  }
	  if (res != null) {
		res = res.data;
		if (isShowError) {
		  new Error(res)
		} else {
		  if (res.code != 1) {
			new Error(res.msg);
		  }
		}
	  }
	  return res
	} catch (error) {
	  return error
	}
  }

  static async post(url, params, isShowError) {
	try {
	  let res = await axios.post(url, params)
	  if (res != null) {
		res = res.data;
		if (isShowError) {
		  new Error(res)
		} else {
		  if (res.code != 1) {
			new Error(res.msg);
		  }
		}
	  }
	  return res
	} catch (error) {
	  return error
	}
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
